import React from 'react';
import { ABOUT_LETTER, PERSONAL_INFO, SOFT_SKILLS, HOBBIES } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';

const AboutPage: React.FC = () => {
  return (
    <div className="bento-grid">
      {/* Featured Summary - Col 2, Row 2 */}
      <div className="lg:col-span-2 lg:row-span-2 glass-card p-10 flex flex-col justify-center border-l-4 border-brand-cyan relative overflow-hidden group bg-gradient-to-br from-brand-cyan/5 to-transparent">
        <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-all duration-700 group-hover:scale-125">
          <Icon name="user" size={240} />
        </div>
        <div className="relative z-10">
          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
            Crafting <span className="text-gradient">Secure</span> Digital Frontiers.
          </h2>
          <p className="text-slate-400 leading-relaxed text-lg mb-8 max-w-lg">
            Resourceful penetration tester with hands-on experience in vulnerability assessment, network security, and Linux administration. I specialize in identifying critical weaknesses and delivering clear remediation strategies.
          </p>
          {/* Download CV button inserted for direct PDF access. */}
          <a
            href="C:\Users\THINKPAD\Videos\guuleed-maxmuud-aw-abdi---cybersecurity-resume\public\assets\guuleed aw-abdi CV.pdf"
            download
            className="inline-flex items-center gap-3 px-5 py-3 mb-8 bg-brand-cyan text-brand-bg rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 transition-transform active:scale-95"
          >
            <Icon name="file-code" size={18} />
            Download CV (PDF)
          </a>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm group/item hover:border-brand-cyan/30 transition-colors">
              <span className="text-[10px] text-brand-cyan font-mono uppercase tracking-widest block mb-1">LOCATION</span>
              <p className="text-sm font-bold flex items-center gap-2">
                <Icon name="map-pin" size={14} className="text-slate-500" />
                {PERSONAL_INFO.location}
              </p>
            </div>
            <div className="p-5 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm group/item hover:border-brand-cyan/30 transition-colors">
              <span className="text-[10px] text-brand-cyan font-mono uppercase tracking-widest block mb-1">GPA</span>
              <p className="text-sm font-bold flex items-center gap-2">
                <Icon name="award" size={14} className="text-slate-500" />
                3.6 / 4.0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Warm introductory letter inserted for the enhanced About Me section. */}
      <div className="lg:col-span-2 glass-card p-10 flex flex-col justify-center bg-gradient-to-br from-brand-bg to-brand-cyan/5">
        <h3 className="text-xs font-mono text-brand-cyan uppercase tracking-widest mb-8 flex items-center gap-3">
          <div className="w-6 h-[1px] bg-brand-cyan/40"></div>
          About Me
        </h3>
        <div className="space-y-5">
          {ABOUT_LETTER.map((paragraph) => (
            <p key={paragraph} className="text-sm md:text-base text-slate-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Soft Skills - Col 2 */}
      <div className="lg:col-span-2 glass-card p-10 flex flex-col justify-between bg-gradient-to-tr from-brand-purple/5 to-transparent">
        <div>
          <h3 className="text-xs font-mono text-brand-purple uppercase tracking-widest mb-8 flex items-center gap-3">
            <div className="w-6 h-[1px] bg-brand-purple/40"></div>
            Soft Skills
          </h3>
          <div className="flex flex-wrap gap-3">
            {SOFT_SKILLS.map((skill) => (
              <span key={skill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-slate-300 uppercase tracking-widest hover:border-brand-purple/40 hover:text-brand-purple transition-all cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-xs text-slate-500 font-mono italic">"Clear communication, steady teamwork, and practical problem-solving under pressure."</p>
        </div>
      </div>

      {/* Status */}
      <div className="lg:col-span-2 glass-card p-10 flex flex-col justify-center items-center text-center group glass-card-hover bg-gradient-to-b from-brand-purple/5 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
          <Icon name="activity" size={80} />
        </div>
        <div className="w-20 h-20 rounded-full bg-brand-purple/10 flex items-center justify-center mb-6 transition-transform group-hover:rotate-12 shadow-[0_0_20px_rgba(185,103,255,0.15)] backdrop-blur-sm border border-brand-purple/20">
          <Icon name="target" className="text-brand-purple" size={40} />
        </div>
        <h3 className="text-xs font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">Current Status</h3>
        <p className="text-lg font-bold text-brand-purple uppercase tracking-widest flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-purple"></span>
          </span>
          Active Security Researcher
        </p>
      </div>

      {/* Hobbies - Col 2 */}
      <div className="lg:col-span-2 glass-card p-10 flex flex-col justify-center overflow-hidden relative">
        <div className="absolute bottom-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Icon name="activity" size={180} />
        </div>
        <h3 className="text-xs font-mono text-brand-cyan uppercase tracking-widest mb-8 flex items-center gap-3">
          <div className="w-6 h-[1px] bg-brand-cyan/40"></div>
          Beyond the Terminal
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {HOBBIES.map((hobby) => (
            <div key={hobby} className="bg-white/5 p-4 rounded-2xl border border-white/5 text-[10px] font-bold uppercase tracking-widest text-center hover:bg-brand-cyan/20 hover:text-brand-cyan transition-all cursor-default">
              {hobby}
            </div>
          ))}
        </div>
      </div>

       {/* Personal Background Detail */}
       <div className="lg:col-span-2 glass-card p-10 border-r-4 border-brand-purple bg-gradient-to-l from-brand-purple/5 to-transparent flex flex-col justify-center">
        <h3 className="text-xs font-mono text-brand-purple uppercase tracking-widest mb-6 flex items-center gap-3">
          <div className="w-6 h-[1px] bg-brand-purple/40"></div>
          Mission Statement
        </h3>
        <p className="text-md text-slate-300 leading-relaxed italic font-display">
          "From mastering Linux systems to identifying critical vulnerabilities, my journey is driven by a commitment to ethical hacking and the pursuit of digital resilience."
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
