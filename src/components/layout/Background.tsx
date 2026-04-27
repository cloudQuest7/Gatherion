'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

const Background = () => {
  const stars = useMemo(() => {
    const s = [];
    for (let i = 0; i < 80; i++) {
      s.push({
        id: i,
        size: Math.random() * 1.5 + 0.5,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.2,
        duration: Math.random() * 10 + 10, // Very slow twinkle
        delay: Math.random() * 10
      });
    }
    return s;
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-0 overflow-hidden">
      {/* --- Refined Premium Background --- */}
      <div className="absolute inset-0">
        {/* Soft Ambient Glows */}
        <motion.div 
          animate={{ 
            opacity: [0.05, 0.1, 0.05],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-[#B175FF]/10 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.05, 0.12, 0.05],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-[#B175FF]/10 blur-[120px] rounded-full" 
        />

        {/* --- Minimal Star Component --- */}
        <div className="absolute inset-0 z-[1]">
          {stars.map(star => (
            <motion.div 
              key={`star-${star.id}`}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [star.opacity * 0.5, star.opacity, star.opacity * 0.5],
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: "linear"
              }}
              className="absolute rounded-full bg-white"
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                top: `${star.y}%`,
                left: `${star.x}%`,
              }}
            />
          ))}
        </div>

        {/* Very Subtle Grain/Noise Overlay for Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[2]" />
        
        {/* Elegant Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)] z-[3]" />
      </div>
    </div>
  );
};

export default Background;
