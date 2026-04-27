'use client';

import { Calendar, User, FileText, Mail, Twitter, Github, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Section - Logo & Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-full bg-[#B175FF] flex items-center justify-center transform group-hover:rotate-180 transition-all duration-500 shadow-lg shadow-[#B175FF]/20">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              <span className="text-xl font-light tracking-tighter text-white">
            gather<span className="font-bold">ion.</span>
          </span>
            </div>
            <p className="text-zinc-500 max-w-md text-sm leading-relaxed">
              bringing people together through soul's seamless event planning and unforgettable experiences.
            </p>
          </div>

          {/* Right Section - Quick Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white mb-6">Links</h3>
              <ul className="space-y-4">
                {[
                  { label: 'About', icon: <User className="w-3 h-3" /> },
                  { label: 'Events', icon: <Calendar className="w-3 h-3" /> },
                  { label: 'Blog', icon: <FileText className="w-3 h-3" /> },
                  { label: 'Contact', icon: <Mail className="w-3 h-3" /> }
                ].map((item) => (
                  <li key={item.label}>
                    <a href="#" className="text-zinc-500 hover:text-[#B175FF] transition-all flex items-center space-x-3 group">
                      <span className="p-1.5 rounded-lg bg-white/5 group-hover:bg-[#B175FF]/10 transition-colors">
                        {item.icon}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white mb-6">Connect</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Twitter', icon: <Twitter className="w-4 h-4" />, color: 'hover:bg-zinc-800' },
                  { label: 'GitHub', icon: <Github className="w-4 h-4" />, color: 'hover:bg-zinc-800' },
                  { label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, color: 'hover:bg-zinc-800' },
                  { label: 'Instagram', icon: <Instagram className="w-4 h-4" />, color: 'hover:bg-zinc-800' }
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    className={`w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center 
                      ${social.color} transition-all group hover:border-[#B175FF]/30`}
                    aria-label={social.label}
                  >
                    <span className="text-zinc-500 group-hover:text-[#B175FF] transition-colors">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            <span>© {new Date().getFullYear()} soul.</span>
            <span className="hidden md:inline text-zinc-800">•</span>
            <span className="text-white hover:text-[#B175FF] transition-colors cursor-pointer italic">
              Developed by AKI7
            </span>
          </div>
          
          <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-[#B175FF] to-transparent opacity-20" />
      </div>
    </footer>
  );
};

export default Footer;
