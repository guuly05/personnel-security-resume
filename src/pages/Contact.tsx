import React, { useState } from 'react';
import { PERSONAL_INFO } from '../constants.ts';
import { Icon } from '../components/Icon.tsx';
import { motion } from 'motion/react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Thank you for reaching out! I'll respond within 24 hours.");
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bento-grid">
      {/* Contact Form - Col 2, Row 3 */}
      <div className="lg:col-span-2 lg:row-span-3 glass-card p-10">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <Icon name="message-square" className="text-brand-cyan" />
          Get In Touch
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest pl-1">Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-brand-cyan transition-all"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest pl-1">Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-brand-cyan transition-all"
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-brand-cyan uppercase tracking-widest pl-1">Your Message</label>
            <textarea 
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm h-40 focus:outline-none focus:border-brand-cyan transition-all resize-none"
              placeholder="How can I help you today?"
            />
          </div>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-cyan hover:bg-cyan-400 text-brand-bg font-bold py-4 rounded-2xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-brand-bg/30 border-t-brand-bg rounded-full animate-spin" />
            ) : (
              <>
                <Icon name="message-square" size={18} />
                Send Transmission
              </>
            )}
          </button>
        </form>
      </div>

      {/* Contact Info Cards */}
      <div className="lg:col-span-2 glass-card p-10 flex flex-col justify-between overflow-hidden relative">
        <div className="space-y-8">
          <div className="flex items-center gap-6 group">
            <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform">
              <Icon name="mail" size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Email</p>
              <p className="text-sm font-bold">{PERSONAL_INFO.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 group">
            <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform">
              <Icon name="phone" size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Phone</p>
              <p className="text-sm font-bold">{PERSONAL_INFO.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 group">
             <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform">
               <Icon name="linkedin" size={24} />
             </div>
             <div>
               <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">LinkedIn</p>
               <p className="text-sm font-bold truncate">/in/guuleed-aw-abdi</p>
             </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-8 relative h-48 w-full glass-card rounded-3xl overflow-hidden border-dashed border-2 border-white/5 opacity-60 group hover:opacity-100 transition-opacity">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center grayscale transition-transform duration-700 group-hover:scale-110" />
           <div className="absolute inset-0 bg-brand-bg/40 backdrop-blur-[2px]" />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-4 py-2 bg-brand-bg/80 border border-brand-cyan/30 rounded-full flex items-center gap-2">
                <Icon name="map-pin" className="text-brand-cyan" size={14} />
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Hargeisa, Somaliland</span>
              </div>
           </div>
        </div>
      </div>

      {/* Social Shortcut - Col 2 */}
      <div className="lg:col-span-2 glass-card p-8 flex items-center justify-center gap-8 bg-gradient-to-br from-brand-cyan/5 to-brand-purple/5">
        <a href={PERSONAL_INFO.github} target="_blank" className="flex flex-col items-center gap-2 group">
          <Icon name="github" className="text-slate-400 group-hover:text-brand-cyan transition-colors" size={32} />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">GitHub</span>
        </a>
        <div className="w-[1px] h-12 bg-white/10"></div>
        <a href={PERSONAL_INFO.linkedin} target="_blank" className="flex flex-col items-center gap-2 group">
          <Icon name="linkedin" className="text-slate-400 group-hover:text-brand-cyan transition-colors" size={32} />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">LinkedIn</span>
        </a>
      </div>
    </div>
  );
};

export default ContactPage;
