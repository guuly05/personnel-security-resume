import React, { useState, useRef, useEffect } from 'react';
import { CORE_SKILLS, TOOLSET, COURSES } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';
import { motion } from 'motion/react';

const SkillsPage: React.FC = () => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const courseListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (courseListRef.current && !courseListRef.current.contains(event.target as Node)) {
        setActiveCourseId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bento-grid">
      {/* Coursework List - Col 2, Row 2 */}
      <div className="lg:col-span-2 lg:row-span-2 glass-card p-8 flex flex-col overflow-hidden group">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-brand-cyan shadow-[0_0_8px_#22d3ee]"></span>
          IIT Coursework
        </h3>
        <div ref={courseListRef} className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
          {COURSES.map((course) => {
            const expanded = activeCourseId === course.id;
            return (
              <motion.div
                key={course.id}
                layout
                onClick={() => setActiveCourseId(expanded ? null : course.id)}
                className={`p-5 rounded-3xl border border-white/5 bg-white/5 transition-all cursor-pointer shadow-sm ${expanded ? 'border-brand-cyan/40 bg-white/10' : 'hover:border-brand-cyan/30 hover:bg-white/7'}`}
              >
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan flex-shrink-0">
                    <Icon name={course.icon} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-sm font-bold text-white mb-1">{course.title}</h4>
                      <span className={`text-[10px] uppercase tracking-widest ${expanded ? 'text-brand-cyan' : 'text-slate-500'}`}>
                        {expanded ? 'Click elsewhere to collapse' : 'Click to expand'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{course.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-[9px] font-bold text-brand-purple uppercase tracking-tight">
                        Key Outcome: {course.outcomes[0].split(' ').slice(0, 6).join(' ')}...
                      </span>
                    </div>
                  </div>
                </div>

                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.25 }}
                    className="mt-5 space-y-4 text-sm text-slate-300"
                  >
                    <div className="rounded-3xl bg-slate-900/60 p-4 border border-white/10">
                      <p className="text-xs uppercase tracking-widest text-brand-cyan font-bold mb-2">Why it was challenging</p>
                      <p className="leading-relaxed">{course.challenge}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/60 p-4 border border-white/10">
                      <p className="text-xs uppercase tracking-widest text-brand-purple font-bold mb-2">What I learned</p>
                      <p className="leading-relaxed">{course.learned}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-900/60 p-4 border border-white/10">
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-2">Key takeaways</p>
                      <ul className="list-disc list-inside space-y-2 text-slate-300">
                        {course.outcomes.map((outcome, index) => (
                          <li key={index}>{outcome}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Toolset Grid - Col 2 */}
      <div className="lg:col-span-2 glass-card p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Icon name="cpu" className="text-brand-purple" size={20} />
          Technical Toolset
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {TOOLSET.map((tool) => (
            <div key={tool} className="group flex flex-col items-center gap-2 p-3 glass-card glass-card-hover border-transparent hover:border-brand-cyan/20">
              <Icon name={tool === 'Linux' ? 'terminal' : tool.toLowerCase()} className="text-slate-400 group-hover:text-brand-cyan transition-colors" size={20} />
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tighter">{tool}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Core Capability Badges - Large Footer/Bottom Col 4 */}
      <div className="lg:col-span-4 glass-card p-6 flex flex-wrap gap-3 items-center justify-center bg-gradient-to-br from-brand-cyan/5 to-brand-purple/5">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest mr-4">Capabilities:</span>
        {CORE_SKILLS.map((skill) => (
          <span 
            key={skill}
            className="px-4 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-2xl font-mono text-xs hover:border-brand-cyan/40 transition-all cursor-default"
          >
            {skill.split(' ').slice(0, 3).join(' ')}
          </span>
        ))}
      </div>

      {/* Secondary Tooling/Context - Col 2 Row 1 */}
      <div className="lg:col-span-2 glass-card p-8 border-b-4 border-brand-cyan flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-brand-cyan font-bold text-sm uppercase font-mono tracking-widest">Mastery Level</h4>
          <p className="text-xs text-slate-400">Security-First Scripting & Hardening</p>
        </div>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(i => <div key={i} className={`w-2 h-6 rounded ${i <= 4 ? 'bg-brand-cyan' : 'bg-white/10'}`}></div>)}
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
