import React from 'react';
import { ArrowDown, ArrowUpRight, Github, Globe2 } from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import { CASE_STUDIES, type CaseStudy } from '../data/caseStudies.ts';

const featuredStudy = CASE_STUDIES.find((study) => study.id === 'samaale-general-trading') ?? CASE_STUDIES[0];
const otherStudies = CASE_STUDIES.filter((study) => study.id !== featuredStudy?.id);

function ProjectLinks({ study }: { study: CaseStudy }) {
  return (
    <div className="work-card-links">
      <a className="work-case-link" href={`/portfolio/${study.id}`}>
        Read the case study <ArrowUpRight size={15} aria-hidden="true" />
      </a>
      {study.liveUrl && (
        <a className="work-external-link" href={study.liveUrl} target="_blank" rel="noreferrer noopener">
          <Globe2 size={14} aria-hidden="true" /> <span>Visit live site</span>
        </a>
      )}
      {study.githubUrl && (
        <a className="work-external-link" href={study.githubUrl} target="_blank" rel="noreferrer noopener">
          <Github size={14} aria-hidden="true" /> <span>Source</span>
        </a>
      )}
    </div>
  );
}

function ProjectCard({ study, featured = false, reversed = false }: { study: CaseStudy; featured?: boolean; reversed?: boolean }) {
  const visibleTech = study.techStack.slice(0, 4).map((item) => item.name);

  return (
    <motion.article
      className={`work-card${featured ? ' work-card-featured' : ''}${reversed ? ' work-card-reversed' : ''}`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
    >
      <a className="work-card-image-link" href={`/portfolio/${study.id}`} aria-label={`Read the ${study.title} case study`}>
        <div className="work-card-image-wrap">
          <img
            className={study.imageUrl.endsWith('.svg') ? 'is-work-illustration' : undefined}
            src={study.imageUrl}
            alt={study.imageAlt}
            loading={featured ? 'eager' : 'lazy'}
            decoding="async"
          />
        </div>
      </a>

      <div className="work-card-content">
        <div className="work-card-eyebrow">
          <span>{study.type}</span><span aria-hidden="true">·</span><span>{study.year}</span>
        </div>
        <h2><a href={`/portfolio/${study.id}`}>{study.title}</a></h2>
        <p className="work-card-summary">{study.subtitle}</p>
        <p className="work-card-role">{study.role}</p>
        <p className="work-card-result">{study.highlights[0]}</p>
        <p className="work-card-tech">{visibleTech.join(' · ')}</p>
        <ProjectLinks study={study} />
      </div>
    </motion.article>
  );
}

const PortfolioPage: React.FC = () => (
  <MotionConfig reducedMotion="user">
    <div className="portfolio-page">
      <section className="work-hero" aria-labelledby="work-title">
        <div className="work-hero-copy">
          <p className="work-kicker"><span>Selected work</span><span aria-hidden="true">/</span><span>2024—2026</span></p>
          <h1 id="work-title">From interface<br /><span>to infrastructure.</span></h1>
          <p className="work-hero-summary">A selection of products and security work, with the problem, decisions, and evidence behind each one.</p>
          <a className="work-hero-link" href="/systems">How I approach the work <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="work-hero-aside" aria-label="Portfolio focus">
          <p>Product engineering</p>
          <p>Security-minded systems</p>
          <p>Useful, considered interfaces</p>
          <a href="#selected-projects" aria-label="Scroll to selected projects"><ArrowDown size={18} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="work-projects" id="selected-projects" aria-labelledby="selected-projects-title">
        <div className="work-section-heading">
          <div>
            <p className="work-kicker">A few things I’ve made</p>
            <h2 id="selected-projects-title">Selected projects</h2>
          </div>
          <p>{String(CASE_STUDIES.length).padStart(2, '0')} projects <span aria-hidden="true">·</span> product, web, and security</p>
        </div>

        <div className="work-project-list">
          {featuredStudy && <ProjectCard study={featuredStudy} featured />}
          {otherStudies.map((study, index) => <ProjectCard key={study.id} study={study} reversed={index % 2 === 0} />)}
        </div>
      </section>

      <section className="work-contact" aria-label="Get in touch">
        <p className="work-kicker">Have a good problem?</p>
        <div><h2>Let’s make it clearer.</h2><a href="/contact">Get in touch <ArrowUpRight size={16} aria-hidden="true" /></a></div>
      </section>
    </div>
  </MotionConfig>
);

export default PortfolioPage;
