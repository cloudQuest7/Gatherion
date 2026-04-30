'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function GuestsPage() {
  const { guests, loading } = useDashboardData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      <div>
        <h2 className="text-4xl md:text-5xl font-light text-white mb-2 italic tracking-tight">guests</h2>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">people attending your upcoming events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-zinc-900/40 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : guests.length === 0 ? (
          <div className="col-span-full p-20 border border-dashed border-white/5 rounded-[3rem] text-center bg-zinc-950/20 backdrop-blur-sm">
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest italic">no guests have rsvp&apos;d to your events yet</p>
          </div>
        ) : (
          guests.map((guest, i) => (
            <motion.div 
              key={guest.id + i}
              whileHover={{ y: -5, x: 4 }}
              className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2.5rem] flex items-center gap-4 group hover:border-[#B175FF]/20 hover:bg-zinc-900/60 transition-all"
            >
              <div className="w-14 h-14 rounded-[1.25rem] overflow-hidden border border-white/5 grayscale group-hover:grayscale-0 transition-all bg-zinc-800 shrink-0 relative">
                <Image
                  src={guest.photoURL || `https://randomuser.me/api/portraits/thumb/${i % 2 === 0 ? 'men' : 'women'}/${(i % 50) + 20}.jpg`}
                  alt="Guest"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-light text-lg italic group-hover:text-[#B175FF] transition-colors truncate">{guest.displayName}</h4>
                <p className="text-[8px] text-zinc-500 uppercase tracking-widest mt-1 truncate">Attending: {guest.attendingEvent}</p>
              </div>
              <div className="p-3 bg-zinc-950/40 rounded-2xl group-hover:bg-[#B175FF]/10 transition-colors shrink-0">
                <CheckCircle2 className="w-4 h-4 text-zinc-800 group-hover:text-[#B175FF] transition-colors" />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
