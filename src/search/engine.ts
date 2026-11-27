import type { SearchDocument } from './catalog.ts';

export type SearchResult = Pick<SearchDocument, 'id' | 'title' | 'kind' | 'url'> & { score: number; excerpt: string };
export type SearchResponse = { results: SearchResult[]; suggestions: string[]; correction: string | null };
export type SearchEngine = ((query: string, limit?: number) => SearchResult[]) & { respond: (query: string, limit?: number) => SearchResponse };
type WasmModule = { WasmSearch: new (json: string) => { respond(query: string, limit: number): string } };

const normalize = (text: string) => text.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const tokenize = (text: string) => normalize(text).split(/\s+/).filter((term) => term.length > 1);

function createBrowserSearch(documents: SearchDocument[]) {
  const search = (query: string, limit = 10): SearchResult[] => {
    const terms = tokenize(query);
    if (!terms.length) return [];
    const phrase = normalize(query);
    return documents.map((document) => {
      const fields = [
        { text: document.title, weight: 8 },
        { text: document.tags.join(' '), weight: 5 },
        { text: document.summary, weight: 3 },
        { text: document.body, weight: 1 },
      ];
      const normalizedFields = fields.map(({ text, weight }) => ({ text: normalize(text), weight }));
      let score = 0;
      for (const term of terms) {
        for (const field of normalizedFields) {
          for (const word of field.text.split(/\s+/)) {
            if (word === term) score += field.weight;
            else if (term.length >= 3 && word.startsWith(term)) score += field.weight * 0.72;
          }
        }
      }
      const metadata = normalizedFields.slice(0, 3).map(({ text }) => text).join(' ');
      if (metadata.includes(phrase)) score += 6;
      if (terms.every((term) => metadata.split(/\s+/).some((word) => word.startsWith(term)))) score *= 1.18;
      return { id: document.id, title: document.title, kind: document.kind, url: document.url, score, excerpt: makeExcerpt(document.body, terms, document.summary) };
    }).filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, Math.min(limit, 30));
  };
  return Object.assign(search, { respond(query: string, limit = 10): SearchResponse {
    const terms = tokenize(query);
    const results = search(query, limit);
    const words = new Set(documents.flatMap((document) => normalize(`${document.title} ${document.tags.join(' ')} ${document.summary}`).split(' ')));
    const prefix = terms.at(-1) ?? '';
    const suggestions = prefix.length < 2 ? [] : [...words].filter((word) => word.startsWith(prefix) && word !== prefix).sort((a, b) => a.length - b.length || a.localeCompare(b)).slice(0, 6);
    return { results, suggestions, correction: null };
  } }) as SearchEngine;
}

function makeExcerpt(body: string, terms: string[], fallback: string) {
  const words = body.split(/\s+/).filter(Boolean);
  if (!words.length) return fallback.slice(0, 191);
  const hit = words.findIndex((word) => terms.some((term) => normalize(word).includes(term)));
  const start = Math.max(0, (hit < 0 ? 0 : hit) - 12);
  const end = Math.min(words.length, (hit < 0 ? 0 : hit) + 18);
  let excerpt = words.slice(start, end).join(' ');
  if (start > 0) excerpt = `…${excerpt}`;
  if (end < words.length) excerpt += '…';
  return excerpt.length > 192 ? `${excerpt.slice(0, 191)}…` : excerpt;
}

/** Prefer Rust/Wasm, with an in-browser fallback when a host CSP blocks Wasm. */
export async function createSearchEngine(documents: SearchDocument[]) {
  if (import.meta.env.DEV) return createBrowserSearch(documents);
  try {
    const wasm = await import('./wasm-loader.ts') as unknown as WasmModule;
    const engine = new wasm.WasmSearch(JSON.stringify(documents));
    const search = (query: string, limit = 10) => JSON.parse(engine.respond(query, limit)).results as SearchResult[];
    return Object.assign(search, { respond: (query: string, limit = 10) => JSON.parse(engine.respond(query, limit)) as SearchResponse }) as SearchEngine;
  } catch {
    return createBrowserSearch(documents);
  }
}
