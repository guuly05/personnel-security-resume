import { Icon } from '../components/Icon.tsx';

export default function NotFoundPage() {
  return (
    <section className="not-found-shell surface-card relative overflow-hidden p-6 md:p-10">
      <div className="absolute right-0 top-0 h-28 w-28 border-b border-l border-dashed border-[var(--border)]" aria-hidden />
      <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div className="space-y-5">
          <p className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-brand-cyan">
            <Icon name="terminal" size={16} />
            Route scan failed
          </p>
          <h1 className="font-display text-5xl font-bold leading-none text-[var(--color-text)] sm:text-6xl md:text-7xl">
            404
          </h1>
          <p className="max-w-xl text-base leading-7 text-[var(--color-text-muted)]">
            This page is not in the portfolio map. The link may have moved, or the address may have a typo.
          </p>
        </div>

        <div className="border border-dashed border-[var(--border)] bg-[var(--surface-soft)] p-5 md:p-6">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            <span>Suggested routes</span>
            <span className="text-[var(--accent)]">Recovered</span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { href: '/', label: 'Home', icon: 'home' },
              { href: '/book', label: 'Book a Call', icon: 'calendar' },
              { href: '/contact', label: 'Contact', icon: 'mail' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="not-found-link flex min-h-24 flex-col justify-between border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent)]"
              >
                <Icon name={item.icon} size={20} className="text-[var(--accent)]" />
                <span className="font-semibold text-[var(--color-text)]">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
