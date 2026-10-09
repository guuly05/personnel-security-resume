import React from 'react';
import { ACHIEVEMENTS, PERSONAL_INFO } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';
import { BLOG_POSTS, formatBlogDate } from '../blog/posts.ts';
import { CASE_STUDIES } from './Portfolio.tsx';

const featuredStudy = CASE_STUDIES[0];
const supportingStudies = CASE_STUDIES.slice(1, 4);
const latestPost = BLOG_POSTS[0];
const heroSkills = ['Full-stack engineering', 'Cybersecurity', 'DevOps', 'React / TypeScript', 'Cloud deployment'];

const clientTestimonials = [
  {
    quote: 'I liked that Guuleed took time to understand our business. The website brings our products and services together in one place and gives customers a clear way to reach us.',
    name: 'Esse Haji Ismail Mohamed',
    role: 'General Manager · Samaale General Trading Co.',
  },
  {
    quote: 'Guuleed built an agent to help me keep on top of online bookings for MGH. Running a cake business keeps me busy, so having support with booking requests is a real help.',
    name: 'Hoodo Ahmad Abdi',
    role: 'Owner · MGH online cake business',
  },
];

const proofPoints = [
  { value: String(CASE_STUDIES.length).padStart(2, '0'), label: 'documented case studies', detail: 'Products, systems, security work, and learning.' },
  { value: '03', label: 'engineering strengths', detail: 'Full-stack development, cybersecurity, and DevOps.' },
  { value: '02', label: 'languages shipped', detail: 'English and Somali experiences in production work.' },
  { value: '05+', label: 'security controls', detail: 'Validation, rate limits, headers, and abuse protection.' },
];

const exploreLinks = [
  { href: '/skills', label: 'Capabilities', detail: 'The tools behind the work' },
  { href: '/experience', label: 'Experience', detail: 'Where I have put them to use' },
  { href: '/systems', label: 'Systems atlas', detail: 'How engineering decisions connect across projects' },
  { href: '/certificates', label: 'Learning', detail: 'What I am sharpening next' },
  { href: '/blog', label: 'Notes', detail: 'Ideas, systems, and things I am learning' },
];

const HomePage: React.FC = () => (
  <div className="landing-page">
    <section className="landing-hero">
      <div className="landing-hero-copy">
        <div className="landing-kicker">
          <span className="landing-kicker-mark" />
          <span>Full-stack developer · {PERSONAL_INFO.location}</span>
        </div>

        <h1 className="landing-title">
          I build useful software,
          <span>and care what happens after launch.</span>
        </h1>

        <p className="landing-lede">
          I’m {PERSONAL_INFO.name.split(' ')[0]} — a full-stack developer who brings cybersecurity and
          DevOps into how I design, build, secure, and ship useful software.
        </p>

        <div className="landing-actions">
          <a href="/assets/Guuleed-Maxamuud-Awabdi-CV.pdf" target="_blank" rel="noreferrer" className="landing-button landing-button-primary">
            View my CV <Icon name="file-text" size={16} />
          </a>
          <a href="/portfolio" className="landing-button landing-button-secondary">
            See selected work <Icon name="arrow-up-right" size={16} />
          </a>
        </div>

        <div className="landing-skill-line" aria-label="Core skills">
          {heroSkills.map((skill, index) => (
            <React.Fragment key={skill}>
              {index > 0 && <span className="landing-skill-separator">·</span>}
              <span>{skill}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="landing-hero-aside">
        <div className="landing-aside-topline">
          <span>Current focus</span>
          <span className="landing-aside-index">/ 01</span>
        </div>
        <div className="landing-aside-visual">
          <div className="landing-aside-orbit landing-aside-orbit-one" />
          <div className="landing-aside-orbit landing-aside-orbit-two" />
          <div className="landing-aside-crosshair landing-aside-crosshair-one" />
          <div className="landing-aside-crosshair landing-aside-crosshair-two" />
          <div className="landing-aside-center">
            <span className="landing-aside-center-label">open to roles</span>
            <strong>full-stack</strong>
            <span>→ cybersecurity → DevOps</span>
          </div>
        </div>
        <div className="landing-aside-caption">
          <p>Looking for full-stack developer opportunities where secure engineering and reliable delivery matter.</p>
          <span>Scroll to explore ↓</span>
        </div>
      </div>
    </section>

    <section className="landing-positioning" aria-label="What Guuleed helps with">
      <div>
        <span className="landing-section-index">/ what I help with</span>
        <h2>From useful interface to dependable operation.</h2>
      </div>
      <div className="landing-positioning-grid">
        <div><strong>Product engineering</strong><p>React, TypeScript, APIs, and thoughtful interfaces that solve a real problem.</p></div>
        <div><strong>Delivery systems</strong><p>CI/CD, cloud deployment, Linux operations, automation, and documentation that reduce friction.</p></div>
        <div><strong>Secure engineering</strong><p>Practical validation, access control, vulnerability assessment, and security-minded architecture.</p></div>
      </div>
    </section>

    <section className="landing-booking" aria-label="Current job search focus">
      <div className="landing-booking-label">
        <span className="landing-section-index">/ current focus</span>
        <span className="landing-booking-status"><span className="landing-booking-status-dot" /> Open to opportunities</span>
      </div>
      <div className="landing-booking-copy">
        <h2>Looking for my next full-stack developer role.</h2>
        <p>I’m interested in teams building useful products with secure engineering and dependable delivery built into the work.</p>
      </div>
      <div className="landing-booking-meta">
        <div><span>Role</span><strong>Full-stack developer</strong></div>
        <div><span>Strengths</span><strong>Cybersecurity · DevOps</strong></div>
        <div><span>Location</span><strong>Hargeisa · Remote ready</strong></div>
      </div>
      <a href="/contact" className="landing-button landing-button-primary">
        Contact me <Icon name="arrow-up-right" size={16} />
      </a>
    </section>

    <section className="landing-proof" aria-label="Selected proof points">
      {proofPoints.map((point) => (
        <div className="landing-proof-item" key={point.value}>
          <span className="landing-proof-number">{point.value}</span>
          <div>
            <strong>{point.label}</strong>
            <p>{point.detail}</p>
          </div>
        </div>
      ))}
    </section>

    <section className="landing-featured">
      <div className="landing-section-heading">
        <div>
          <span className="landing-section-index">01 / selected work</span>
          <h2>One project, properly unpacked.</h2>
        </div>
        <p>The best way to understand how I work is to look at something that had to survive contact with the real world.</p>
      </div>

      <div className="landing-featured-grid">
        <a href={`/portfolio/${featuredStudy.id}`} className="landing-project-image-wrap">
          <img src={featuredStudy.imageUrl} alt={featuredStudy.imageAlt} className="landing-project-image" />
          <span className="landing-image-label">Case study <Icon name="arrow-up-right" size={15} /></span>
        </a>
        <div className="landing-featured-copy">
          <div className="landing-project-meta">
            <span>{featuredStudy.type}</span>
            <span>{featuredStudy.year}</span>
            <span>{featuredStudy.status}</span>
          </div>
          <h3>{featuredStudy.title}</h3>
          <p className="landing-featured-summary">{featuredStudy.subtitle}</p>
          <div className="landing-project-facts">
            <div><span>Role</span><strong>{featuredStudy.role}</strong></div>
            <div><span>Outcome</span><strong>{featuredStudy.outcome.split('. ')[0]}.</strong></div>
          </div>
          <a href={`/portfolio/${featuredStudy.id}`} className="landing-text-link">
            Read the full case study <Icon name="arrow-up-right" size={16} />
          </a>
        </div>
      </div>
    </section>

    <section className="landing-work-list">
      <div className="landing-section-heading landing-section-heading-compact">
        <div>
          <span className="landing-section-index">02 / more work</span>
          <h2>Different problems, same care.</h2>
        </div>
        <a href="/portfolio" className="landing-text-link">See everything <Icon name="arrow-up-right" size={16} /></a>
      </div>

      <div className="landing-project-list">
        {supportingStudies.map((study, index) => (
          <a href={`/portfolio/${study.id}`} className="landing-project-row" key={study.id}>
            <span className="landing-project-row-number">0{index + 2}</span>
            <div className="landing-project-row-main">
              <div className="landing-project-row-meta"><span>{study.type}</span><span>{study.year}</span></div>
              <h3>{study.title}</h3>
              <p>{study.subtitle}</p>
            </div>
            <span className="landing-project-row-arrow"><Icon name="arrow-up-right" size={20} /></span>
          </a>
        ))}
      </div>
    </section>

    <section className="landing-client-quotes" aria-labelledby="client-quotes-title">
      <div className="landing-section-heading">
        <div>
          <span className="landing-section-index">/ client feedback</span>
          <h2 id="client-quotes-title">The work, in their words.</h2>
        </div>
        <p>Two client perspectives on building useful tools for their businesses.</p>
      </div>
      <div className="landing-client-quote-grid">
        {clientTestimonials.map((item) => (
          <figure className="landing-client-quote-card" key={item.name}>
            <blockquote>“{item.quote}”</blockquote>
            <figcaption>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>

    <section className="landing-notes-grid">
      <div className="landing-notes-intro">
        <span className="landing-section-index">03 / the person behind it</span>
        <h2>Curious about the whole system.</h2>
        <p>
          I enjoy the parts of software that are easy to overlook: the awkward edge case, the quiet
          deployment fix, the sentence in the documentation that saves someone an afternoon.
        </p>
        <a href="/about" className="landing-text-link">More about me <Icon name="arrow-right" size={16} /></a>
      </div>

      <div className="landing-notes-links">
        {exploreLinks.map((link, index) => (
          <a href={link.href} className="landing-note-link" key={link.href}>
            <span>0{index + 1}</span>
            <div><strong>{link.label}</strong><p>{link.detail}</p></div>
            <Icon name="arrow-up-right" size={16} />
          </a>
        ))}
      </div>
    </section>

    {latestPost && (
      <section className="landing-latest-note">
        <div className="landing-section-heading landing-section-heading-compact">
          <div>
            <span className="landing-section-index">04 / latest note</span>
            <h2>What I’m thinking about now.</h2>
          </div>
          <a href="/blog" className="landing-text-link">Browse all notes <Icon name="arrow-up-right" size={16} /></a>
        </div>

        <a href={`/blog/${latestPost.slug}`} className="landing-latest-note-card">
          <div className="landing-latest-note-visual" aria-hidden="true">
            <span className="landing-latest-note-orbit landing-latest-note-orbit-one" />
            <span className="landing-latest-note-orbit landing-latest-note-orbit-two" />
            <span className="landing-latest-note-mark">/</span>
            <span className="landing-latest-note-visual-label">field note / 01</span>
            <span className="landing-latest-note-mood">{latestPost.mood}</span>
          </div>
          <div className="landing-latest-note-copy">
            <div className="landing-project-meta">
              <span>{formatBlogDate(latestPost.date)}</span>
              <span>{latestPost.readTime}</span>
            </div>
            <h3>{latestPost.title}</h3>
            <p>{latestPost.subtitle}</p>
            <div className="landing-latest-note-footer">
              <div className="landing-note-tags">{latestPost.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
              <span className="landing-text-link">Read note <Icon name="arrow-up-right" size={16} /></span>
            </div>
          </div>
        </a>
      </section>
    )}

    <section className="landing-closing">
      <div>
        <span className="landing-section-index">05 / next move</span>
        <h2>Let’s build useful software.</h2>
      </div>
      <div className="landing-closing-action">
        <p>See how I work, or get in touch about a full-stack opportunity.</p>
        <a href="/assets/Guuleed-Maxamuud-Awabdi-CV.pdf" target="_blank" rel="noreferrer" className="landing-button landing-button-primary">View my CV <Icon name="file-text" size={16} /></a>
        <a href="/contact" className="landing-button landing-button-secondary">Contact me <Icon name="arrow-right" size={16} /></a>
      </div>
    </section>

    <div className="sr-only" aria-hidden="true">{ACHIEVEMENTS.length} proof points</div>
  </div>
);

export default HomePage;
