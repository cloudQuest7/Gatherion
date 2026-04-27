'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { useRouter } from 'next/navigation';
import { ArrowRight, Users, Sparkles } from 'lucide-react';

interface HeroProps {
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

const Hero = ({ setActiveSection }: HeroProps) => {
  const router = useRouter();

  const onGetStarted = () => {
    router.push('/login');
  };

  return (
    <section id="hero" className="pt-32 pb-32 relative overflow-hidden bg-black">
      {/* --- Refined Background: Soft Organic Glows --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
         
          {/* --- Sophisticated Typography --- */}
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              className="text-7xl md:text-8xl lg:text-9xl font-light tracking-tighter text-white leading-[0.9] italic"
            >
              plan with <span className="text-purple-400 font-normal not-italic">Gatherion.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed"
            >
              Gatherion is the quiet space where your grandest ideas turn into unforgettable gatherings. No noise, just pure connection.
            </motion.p>
          </div>

          {/* --- Minimalist CTAs --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGetStarted}
              className="px-10 py-5 bg-white text-black text-sm font-bold uppercase tracking-widest rounded-full hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center gap-3 group"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 bg-zinc-900/50 text-white text-sm font-bold uppercase tracking-widest rounded-full border border-white/10 hover:bg-zinc-900 transition-all"
            >
              View Gallery
            </motion.button>
          </motion.div>

          {/* --- Visual Element: Clean & Organic --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="w-full aspect-[21/9] relative mt-12"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
            <div className="absolute inset-0 border border-white/5 rounded-[3rem] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80" 
                className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
                alt="Event Atmosphere"
              />
            </div>
            
            {/* Floating Organic Element */}
            <motion.div 
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-tr from-purple-500/20 to-transparent blur-2xl rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
