import React from 'react';
import { CERTIFICATES } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';
import { motion } from 'motion/react';

const CertificatesPage: React.FC = () => {
  return (
    <div className="bento-grid">
      {/* Certifications List - Col 3, Row 2 */}
      <div className="lg:col-span-3 lg:row-span-2 glass-card p-10 flex flex-col overflow-hidden">
        <h3 className="text-3xl font-bold mb-8 flex items-center gap-4">
          <Icon name="shield-check" className="text-brand-cyan" size={32} />
          Validated Credentials
        </h3>
        <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide pr-4">
          {CERTIFICATES.map((cert) => (
            <div key={cert.title} className="flex gap-6 p-6 border-l-2 border-brand-cyan bg-white/5 rounded-r-[1.5rem] group hover:bg-white/10 transition-colors relative">
              <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan flex-shrink-0 group-hover:scale-110 transition-transform">
                <Icon name={cert.icon} size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  {cert.verifyLink ? (
                    <a 
                      href={cert.verifyLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group/title"
                    >
                      <h4 className="font-bold text-lg text-white group-hover/title:text-brand-cyan transition-colors">{cert.title}</h4>
                    </a>
                  ) : (
                    <h4 className="font-bold text-lg text-white">{cert.title}</h4>
                  )}
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-mono font-bold text-brand-cyan uppercase bg-brand-cyan/10 px-2 py-1 rounded">
                      {cert.date}
                    </span>
                    {cert.verifyLink && (
                      <a 
                        href={cert.verifyLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[9px] font-bold text-brand-purple hover:text-white uppercase tracking-widest transition-colors"
                      >
                        <Icon name="external-link" size={10} />
                        Verify Authenticity
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-[11px] font-bold text-brand-purple uppercase tracking-widest mb-3">{cert.issuer}</p>
                <p className="text-sm text-slate-400 leading-relaxed italic border-t border-white/5 pt-3 mt-3">
                  "{cert.description}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Summary - Col 1 */}
      <div className="lg:col-span-1 glass-card p-10 flex flex-col justify-center items-center text-center border-t-8 border-brand-purple">
        <h3 className="text-xs font-mono text-brand-purple uppercase tracking-widest mb-6">Education</h3>
        <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-6">
          <Icon name="graduation-cap" size={32} />
        </div>
        <p className="text-2xl font-bold mb-1 leading-tight">B.Sc. CS</p>
        <p className="text-sm text-slate-400 mb-6 italic">University of Hargeisa</p>
        <div className="w-full h-[1px] bg-white/10 mb-6"></div>
        <p className="text-xs font-mono text-brand-purple font-bold">2022 — 2027</p>
      </div>

      {/* Stats Block - Col 1 */}
      <div className="lg:col-span-1 glass-card p-8 flex flex-col justify-center items-center text-center glass-card-hover group">
        <div className="text-5xl font-display font-bold text-brand-cyan mb-2 group-hover:scale-110 transition-transform">6+</div>
        <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500">Security Credentials</p>
      </div>

      {/* Horizontal List of Coursework - Col 4 Bottom */}
      <div className="lg:col-span-4 glass-card p-6 flex items-center justify-center gap-12 bg-white/2 bg-gradient-to-br from-brand-bg to-brand-purple/5">
        {["Network Security", "Cryptography", "Operating Systems", "Web Security", "Secure SDLC"].map((course) => (
          <div key={course} className="flex flex-col items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-purple shadow-[0_0_8px_rgba(185,103,255,0.8)]" />
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{course}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificatesPage;
