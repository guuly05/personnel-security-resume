import { useEffect, useRef, useState } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { createSearchEngine, type SearchResult } from './engine.ts';
import { SEARCH_DOCUMENTS } from './catalog.ts';

type Props = { open: boolean; onClose: () => void; onNavigate: (url: string) => void };

export function SearchDialog({ open, onClose, onNavigate }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<SearchResult[]>([]);
  const selectedRef = useRef(0);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState<null | ((query: string, limit?: number) => SearchResult[])>(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  resultsRef.current = results;
  selectedRef.current = selected;

  useEffect(() => {
    if (!open) return;
    setQuery(''); setResults([]); setError(''); setSelected(0);
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key === 'ArrowDown') { event.preventDefault(); setSelected((value) => Math.min(value + 1, resultsRef.current.length - 1)); }
      if (event.key === 'ArrowUp') { event.preventDefault(); setSelected((value) => Math.max(value - 1, 0)); }
      if (event.key === 'Enter' && resultsRef.current[selectedRef.current]) { event.preventDefault(); onNavigate(resultsRef.current[selectedRef.current].url); onClose(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { cancelAnimationFrame(frame); document.removeEventListener('keydown', onKeyDown); previous?.focus(); };
  }, [open, onClose, onNavigate]);

  useEffect(() => {
    if (!open || search) return;
    let cancelled = false;
    createSearchEngine(SEARCH_DOCUMENTS).then((engine) => { if (!cancelled) setSearch(() => engine); })
      .catch((reason: unknown) => { if (!cancelled) setError(reason instanceof Error ? reason.message : 'Search could not be loaded.'); });
    return () => { cancelled = true; };
  }, [open, search]);

  useEffect(() => {
    setSelected(0);
    if (!query.trim()) { setResults([]); return; }
    if (!search) return;
    try { setResults(search(query, 12)); setError(''); }
    catch { setResults([]); setError('Search failed. Please try again.'); }
  }, [query, search]);

  if (!open) return null;
  return <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-label="Search portfolio" className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
        <Search size={20} className="shrink-0 text-[var(--accent)]" />
        <input ref={inputRef} type="search" role="combobox" aria-expanded={results.length > 0} aria-controls="global-search-results" aria-activedescendant={results[selected] ? `search-result-${selected}` : undefined} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, writing, skills…" className="min-h-14 w-full bg-transparent text-base text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]" />
        <button type="button" onClick={onClose} aria-label="Close search" className="rounded-md p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"><X size={18} /></button>
      </div>
      <div id="global-search-results" role="listbox" aria-label="Search results" className="max-h-[60vh] overflow-y-auto p-2">
        {error ? <p role="alert" className="p-5 text-sm text-rose-400">{error}</p> : !search ? <p className="p-5 text-sm text-[var(--color-text-muted)]">Loading local search…</p> : query.trim() && results.length === 0 ? <p className="p-5 text-sm text-[var(--color-text-muted)]">No matches. Try a different phrase.</p> : results.map((result, index) => <button id={`search-result-${index}`} key={result.id} type="button" role="option" aria-selected={selected === index} onMouseEnter={() => setSelected(index)} onClick={() => { onNavigate(result.url); onClose(); }} className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition ${selected === index ? 'bg-[var(--accent-soft)]' : 'hover:bg-[var(--surface-soft)]'}`}>
          <span className="mt-0.5 rounded-md border border-[var(--border)] px-2 py-1 text-[10px] font-mono uppercase text-[var(--color-text-muted)]">{result.kind}</span>
          <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2 font-semibold text-[var(--color-text)]">{result.title}<ArrowUpRight size={15} className="shrink-0 text-[var(--color-text-muted)]" /></span><span className="mt-1 block line-clamp-2 text-sm text-[var(--color-text-muted)]">{result.excerpt}</span></span>
        </button>)}
      </div>
      <div className="border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--color-text-muted)]">↑↓ to navigate <span className="mx-2">·</span> Enter to open <span className="mx-2">·</span> Esc to close</div>
    </section>
  </div>;
}
