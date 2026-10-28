import React from 'react';
import { PERSONAL_INFO } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';
import { LATEST_POST } from '../blog/latestPost.ts';
import { formatBlogDate } from '../blog/formatBlogDate.ts';
import { CASE_STUDIES } from '../data/caseStudies.ts';

const featuredStudy = CASE_STUDIES[0];
const supportingStudies = CASE_STUDIES.slice(1, 3);
const latestPost = LATEST_POST;

const clientQuote = {
  quote: 'DaryeelPass is a portfolio prototype. It does not connect to clinic scheduling systems, send requests to clinics, or confirm real appointments.',
  name: 'Product boundary',
  role: 'Synthetic demo data only · Never enter real patient information',
};

const proofPoints = [
  { value: 'SO / EN', label: 'Somali and English' },
  { value: '4 roles', label: 'patient and clinic workflows' },
  { value: 'PWA', label: 'responsive installable app' },
  { value: 'RLS', label: 'clinic scoped data access' },
];

const HomePage: React.FC = () => (
  <div className="landing-page">
    <section className="landing-hero" aria-labelledby="landing-title">
      <div className="landing-hero-copy">
        <div className="landing-kicker">
          <span className="landing-kicker-mark" />
          <span>Full-stack developer · {PERSONAL_INFO.location}</span>
        </div>

        <p className="landing-availability"><span /> Open to full-stack roles · Remote ready</p>

        <h1 className="landing-title" id="landing-title">
          I build secure, production-ready products.
        </h1>

        <p className="landing-lede">
          I turn business needs into reliable web apps, working across React and TypeScript, APIs,
          deployment, and practical application security.
        </p>

        <div className="landing-actions">
          <a href={`/portfolio/${featuredStudy.id}`} className="landing-button landing-button-primary">
            View featured work <Icon name="arrow-up-right" size={16} />
          </a>
          <a href="/assets/Guuleed-Maxamuud-Awabdi-CV.pdf" target="_blank" rel="noreferrer" className="landing-button landing-button-secondary">
            Download CV <Icon name="file-text" size={16} />
          </a>
        </div>

        <div className="landing-skill-line" aria-label="Core strengths">
          <span>Product engineering</span>
          <span>Secure by design</span>
          <span>Reliable delivery</span>
        </div>
      </div>

      <aside className="landing-hero-aside" aria-label="Featured project preview">
        <div className="landing-aside-topline">
          <span>Featured project</span>
          <span className="landing-aside-index">01 / {String(CASE_STUDIES.length).padStart(2, '0')}</span>
        </div>
        <a href={`/portfolio/${featuredStudy.id}`} className="landing-hero-art-link">
          <img
            className="landing-hero-art"
            src={featuredStudy.imageUrl}
            alt={featuredStudy.imageAlt}
            width="1500"
            height="1000"
            fetchPriority="high"
            decoding="async"
          />
          <span className="landing-image-label">Open case study <Icon name="arrow-up-right" size={15} /></span>
        </a>
        <div className="landing-hero-project-caption">
          <span>{featuredStudy.type} · {featuredStudy.year}</span>
          <strong>{featuredStudy.title}</strong>
        </div>
      </aside>
    </section>

    <section className="landing-proof" aria-label="DaryeelPass project at a glance">
      <span className="landing-proof-intro">Project at a glance</span>
      {proofPoints.map((point) => (
        <div className="landing-proof-item" key={point.value}>
          <strong className="landing-proof-number">{point.value}</strong>
          <span>{point.label}</span>
        </div>
      ))}
    </section>

    <section className="landing-work-list" aria-labelledby="landing-work-title">
      <div className="landing-section-heading">
        <div>
          <span className="landing-section-index">Selected work</span>
          <h2 id="landing-work-title">Different problems, thoughtful engineering.</h2>
        </div>
        <a href="/portfolio" className="landing-text-link">Browse all projects <Icon name="arrow-up-right" size={16} /></a>
      </div>

      <div className="landing-project-list">
        {supportingStudies.map((study, index) => (
          <a href={`/portfolio/${study.id}`} className="landing-project-row" key={study.id}>
            <span className="landing-project-row-number">0{index + 2}</span>
            <div className="landing-project-row-main">
              <div className="landing-project-row-meta"><span>{study.type}</span><span>{study.year}</span></div>
              <h3>{study.title}</h3>
              <p>{study.subtitle}</p>
              <span className="landing-project-role">{study.role}</span>
            </div>
            <span className="landing-project-row-arrow" aria-hidden="true"><Icon name="arrow-up-right" size={20} /></span>
          </a>
        ))}
      </div>
    </section>

    <section className="landing-about-grid" aria-label="About Guuleed and DaryeelPass product scope">
      <div className="landing-notes-intro">
        <span className="landing-section-index">How I work</span>
        <h2>Curious about the whole system.</h2>
        <p>
          I enjoy the full path from a first interface to the systems that keep it running. Product
          engineering is my focus; security and DevOps shape how I build and ship.
        </p>
        <a href="/about" className="landing-text-link">More about me <Icon name="arrow-right" size={16} /></a>
      </div>

      <figure className="landing-client-quote-card">
        <span className="landing-section-index">Scope, clearly stated</span>
        <blockquote>“{clientQuote.quote}”</blockquote>
        <figcaption>
          <strong>{clientQuote.name}</strong>
          <span>{clientQuote.role}</span>
        </figcaption>
      </figure>
    </section>

    {latestPost && (
      <section className="landing-latest-note" aria-labelledby="landing-note-title">
        <div>
          <span className="landing-section-index">From the notebook · {formatBlogDate(latestPost.date)}</span>
          <h2 id="landing-note-title">{latestPost.title}</h2>
          <p>{latestPost.subtitle}</p>
        </div>
        <a href={`/blog/${latestPost.slug}`} className="landing-text-link">Read the note <Icon name="arrow-up-right" size={16} /></a>
      </section>
    )}

    <section className="landing-closing" aria-labelledby="landing-contact-title">
      <div>
        <span className="landing-section-index">Next step</span>
        <h2 id="landing-contact-title">Let’s build something useful.</h2>
      </div>
      <div className="landing-closing-action">
        <p>Have a full-stack role or project in mind? I’d be glad to talk.</p>
        <a href="/contact" className="landing-button landing-button-primary">Get in touch <Icon name="arrow-up-right" size={16} /></a>
      </div>
    </section>
  </div>
);

export default HomePage;
