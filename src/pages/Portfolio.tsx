import React from 'react';
import { ArrowDown, ArrowUpRight, Github, Globe2 } from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import { CASE_STUDIES, type CaseStudy } from '../data/caseStudies.ts';

const featuredStudy = CASE_STUDIES.find((study) => study.id === 'samaale-general-trading') ?? CASE_STUDIES[0];
const otherStudies = CASE_STUDIES.filter((study) => study.id !== featuredStudy?.id);

function ProjectLinks({ study, featured = false }: { study: CaseStudy; featured?: boolean }) {
  return (
    <div className="work-card-links">
      <a className="work-case-link" href={`/portfolio/${study.id}`}>
        Read the case study <ArrowUpRight size={15} aria-hidden="true" />
      </a>
      {study.liveUrl && (
        <a className="work-external-link" href={study.liveUrl} target="_blank" rel="noreferrer noopener">
          <Globe2 size={14} aria-hidden="true" /> <span>{featured ? 'Visit live site' : 'Live site'}</span>
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

function ProjectCard({ study, index, featured = false }: { study: CaseStudy; index: number; featured?: boolean }) {
  const selectedResults = study.highlights.slice(0, featured ? 2 : 1);
  const visibleTech = study.techStack.slice(0, featured ? 5 : 4);

  return (
    <motion.article
      className={`work-card${featured ? ' work-card-featured' : ''}`}
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
          <span className="work-card-number">{String(index).padStart(2, '0')}</span>
          <span className="work-card-status">{study.status}</span>
          <span className="work-card-image-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
        </div>
      </a>

      <div className="work-card-content">
        <div className="work-card-eyebrow">
          <span>{study.type}</span><span aria-hidden="true">·</span><span>{study.year}</span>
        </div>
        <h2><a href={`/portfolio/${study.id}`}>{study.title}</a></h2>
        <p className="work-card-summary">{study.subtitle}</p>

        <div className="work-card-proof" aria-label="Selected results">
          {selectedResults.map((result) => <p key={result}>{result}</p>)}
        </div>

        <div className="work-card-tech" aria-label="Technologies used">
          {visibleTech.map((item) => <span key={item.name}>{item.name}</span>)}
          {study.techStack.length > visibleTech.length && <span className="work-tech-more">+{study.techStack.length - visibleTech.length}</span>}
        </div>

        <ProjectLinks study={study} featured={featured} />
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

        {featuredStudy && <ProjectCard study={featuredStudy} index={1} featured />}
        <div className="work-project-grid">
          {otherStudies.map((study, index) => <ProjectCard key={study.id} study={study} index={index + 2} />)}
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
