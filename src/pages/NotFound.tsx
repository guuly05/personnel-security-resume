import { Icon } from '../components/Icon.tsx';

export default function NotFoundPage() {
  return (
    <section className="editorial-page not-found-page" aria-labelledby="not-found-title">
      <div className="not-found-main">
        <span className="landing-section-index">/ route not found</span>
        <h1 id="not-found-title">404</h1>
        <p>This address isn’t part of the site. It may have moved, or there may be a typo in the link.</p>
        <a className="landing-button landing-button-primary" href="/">Back to the homepage <Icon name="arrow-right" size={16} /></a>
      </div>
      <nav className="not-found-routes" aria-label="Suggested pages">
        <span className="editorial-overline">Keep exploring</span>
        {[
          { href: '/portfolio', label: 'Selected work', detail: 'Projects and case studies' },
          { href: '/about', label: 'About', detail: 'Background and interests' },
          { href: '/contact', label: 'Contact', detail: 'Start a conversation' },
        ].map((item, index) => (
          <a key={item.href} href={item.href}>
            <span className="editorial-index">0{index + 1}</span>
            <span><strong>{item.label}</strong><small>{item.detail}</small></span>
            <Icon name="arrow-up-right" size={17} />
          </a>
        ))}
      </nav>
    </section>
  );
}
