'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Menu, X, User, Sparkles, Calendar } from 'lucide-react';
import { scrollToSection } from '@/lib/utils';
import Link from 'next/link';

interface NavbarProps {
  isScrolled: boolean;
  activeSection: string;
  setActiveSection: (id: string) => void;
  setIsCalendarModalOpen: (isOpen: boolean) => void;
}

const Navbar = ({ isScrolled, activeSection, setActiveSection, setIsCalendarModalOpen }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'features', label: 'Features', icon: Sparkles },
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'discover', label: 'Explore', icon: Sparkles },
    { id: 'calendar', label: 'Calendar', icon: Calendar, isModal: true },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled ? 'py-4 bg-black/80 backdrop-blur-lg border-b border-white/5' : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        {/* --- Minimalist Logo --- */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-xl font-light tracking-tighter text-white">
            gather<span className="font-bold">ion.</span>
          </span>
        </Link>

        {/* --- Minimalist Nav Links --- */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.isModal) setIsCalendarModalOpen(true);
                else scrollToSection(item.id, setActiveSection);
              }}
              className="relative group py-1"
            >
              <span className={`text-sm font-medium tracking-widest uppercase transition-colors duration-300 ${
                activeSection === item.id ? 'text-white' : 'text-zinc-500 group-hover:text-white'
              }`}>
                {item.label}
              </span>
              <motion.div 
                initial={false}
                animate={{ width: activeSection === item.id ? '100%' : '0%' }}
                className="absolute bottom-0 left-0 h-[1px] bg-purple-500"
              />
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* --- Sharp Actions --- */}
        <div className="flex items-center gap-8">
          <Link href="/login" className="hidden sm:block">
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2 group"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </motion.button>
          </Link>

          {/* --- Minimal Menu Toggle --- */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white md:hidden p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* --- Minimal Fullscreen Mobile Menu --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[110] flex flex-col items-center justify-center space-y-12"
          >
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-8 text-white p-2"
            >
              <X className="w-8 h-8" />
            </button>

            {navItems.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                  if (item.isModal) setIsCalendarModalOpen(true);
                  else scrollToSection(item.id, setActiveSection);
                  setIsMobileMenuOpen(false);
                }}
                className="text-4xl font-light tracking-tighter text-white hover:italic transition-all"
              >
                {item.label}
              </motion.button>
            ))}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="px-8 py-3 border border-white/20 rounded-full text-white text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                  Login
                </button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
