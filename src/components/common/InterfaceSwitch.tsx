'use client';

import { motion } from 'framer-motion';

interface InterfaceSwitchProps {
  interfaceType: 'standard' | 'mock';
  setInterfaceType: (type: 'standard' | 'mock') => void;
}

const InterfaceSwitch = ({ interfaceType, setInterfaceType }: InterfaceSwitchProps) => {
  return (
    <div className="flex justify-center">
      <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-full p-1.5 flex gap-1 relative overflow-hidden">
        {['mock', 'standard'].map((type) => (
          <button
            key={type}
            onClick={() => setInterfaceType(type as 'standard' | 'mock')}
            className={`relative z-10 px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${
              interfaceType === type 
                ? 'text-black' 
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            {type === 'mock' ? 'Soul Editor' : 'Classic Editor'}
            {interfaceType === type && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-white rounded-full -z-10 shadow-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InterfaceSwitch;
