import React from 'react';
import { EXPERIENCES } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';

const ExperiencePage: React.FC = () => {
  return (
    <div className="glass-card p-8 md:p-12 overflow-hidden relative bg-gradient-to-br from-brand-cyan/5 via-transparent to-brand-purple/5">
      <div className="absolute -top-12 -right-10 opacity-[0.04] pointer-events-none">
        <Icon name="briefcase" size={220} />
      </div>

      {/* New Experience section inserted using the site's existing card and typography patterns. */}
      <div className="relative z-10 mb-10">
        <span className="text-[10px] font-mono text-brand-cyan uppercase tracking-[0.35em] font-bold">
          Practical Background
        </span>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mt-4 mb-4">
          Freelance <span className="text-gradient">Experience</span>
        </h2>
        <p className="text-slate-400 leading-relaxed max-w-2xl">
          Hands-on security and IT support engagements completed for a confidential family-owned business, focused on practical risk reduction, reliable support, and clear documentation.
        </p>
      </div>

      <div className="relative z-10 space-y-6">
        {EXPERIENCES.map((experience) => (
          <div
            key={experience.title}
            className="grid gap-6 lg:grid-cols-[260px_1fr] p-6 md:p-8 bg-white/5 border border-white/10 rounded-[1.75rem] hover:border-brand-cyan/30 hover:bg-white/10 transition-all"
          >
            <div className="relative lg:border-r lg:border-white/10 lg:pr-8">
              <div className="hidden lg:block absolute top-2 -right-[7px] w-3 h-3 rounded-full bg-brand-cyan shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-brand-cyan uppercase tracking-widest bg-brand-cyan/10 px-3 py-1.5 rounded-xl mb-5">
                <Icon name="clock" size={12} />
                {experience.dateRange}
              </span>
              <h3 className="text-2xl font-bold text-white leading-tight mb-2">{experience.title}</h3>
              <p className="text-xs font-bold text-brand-purple uppercase tracking-widest">{experience.company}</p>
            </div>

            <ul className="space-y-4">
              {experience.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm md:text-base text-slate-300 leading-relaxed">
                  <Icon name="chevron-right" size={18} className="text-brand-cyan flex-shrink-0 mt-1" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperiencePage;
