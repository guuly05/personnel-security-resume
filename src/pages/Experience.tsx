import React from 'react';
import { EXPERIENCES } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';

const ExperiencePage: React.FC = () => (
  <div className="editorial-page experience-page">
    <header className="editorial-hero">
      <span className="landing-section-index">/ experience</span>
      <h1>Building across the stack, <span>from idea to operation.</span></h1>
      <p>Selected work across product delivery, systems thinking, and security-minded engineering. Each role starts with understanding the context and ends with something a team can use.</p>
    </header>

    <section className="editorial-section" aria-labelledby="experience-list-title">
      <div className="editorial-section-heading">
        <div><span className="landing-section-index">01 / selected roles</span><h2 id="experience-list-title">Work and contribution.</h2></div>
        <span className="editorial-section-count">0{EXPERIENCES.length} roles</span>
      </div>
      <div className="experience-list">
        {EXPERIENCES.map((experience, index) => (
          <article key={experience.title} className="experience-entry">
            <div className="experience-entry-meta">
              <span className="editorial-index">0{index + 1}</span>
              <span>{experience.dateRange}</span>
            </div>
            <div className="experience-entry-copy">
              <p className="editorial-overline">{experience.company}</p>
              <h3>{experience.title}</h3>
              <ul>{experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
      <a className="landing-text-link experience-portfolio-link" href="/portfolio">Explore the related projects <Icon name="arrow-up-right" size={16} /></a>
    </section>
  </div>
);

export default ExperiencePage;
