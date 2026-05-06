import React from 'react';

const PortfolioPage: React.FC = () => {
  return (
    <div className="glass-card p-12 text-center mx-auto max-w-3xl">
      <h2 className="text-4xl font-bold text-white mb-4">Portfolio</h2>
      <p className="text-slate-400 text-base leading-relaxed">
        This section is coming soon. I’m working on gathering the best projects,
        case studies, and live demonstrations to showcase the strongest work.
      </p>
      <div className="mt-10 inline-flex flex-col gap-3 p-8 bg-slate-900/60 border border-white/10 rounded-3xl">
        <span className="text-brand-cyan uppercase tracking-[0.35em] text-[10px] font-bold">Coming Soon</span>
        <p className="text-slate-300 text-sm max-w-xl mx-auto">
          Check back soon for a polished portfolio view that highlights cybersecurity engagements,
          pentesting reports, and secure development examples.
        </p>
      </div>
    </div>
  );
};

export default PortfolioPage;
