import type { SearchDocument } from './catalog.ts';

export type SearchResult = SearchDocument & { score: number; excerpt: string };
type WasmModule = { default: () => Promise<unknown>; WasmSearch: new (json: string) => { search(query: string, limit: number): string } };

/** Loads Rust/Wasm on demand; the corpus and queries remain in this browser. */
export async function createSearchEngine(documents: SearchDocument[]) {
  const wasm = await import('../../search-rust/pkg/portfolio_search.js') as unknown as WasmModule;
  await wasm.default();
  const engine = new wasm.WasmSearch(JSON.stringify(documents));
  return (query: string, limit = 10): SearchResult[] => JSON.parse(engine.search(query, limit)) as SearchResult[];
}
