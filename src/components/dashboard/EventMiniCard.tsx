'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { memo } from 'react';
import { DashboardEvent } from '@/hooks/useDashboardData';

function EventMiniCardContent({ 
  event, 
  formatDate, 
  isOwner, 
  onDelete,
  onClick
}: { 
  event: DashboardEvent, 
  formatDate: (d: Timestamp | string | Date | null | undefined) => string,
  isOwner?: boolean,
  onDelete?: (id: string) => void,
  onClick?: () => void
}) {
  return (
    <motion.div 
      whileHover={{ x: 8 }}
      onClick={onClick}
      className="bg-zinc-900/40 border border-white/5 p-5 rounded-[2rem] flex items-center gap-6 group hover:bg-zinc-900/60 transition-all relative overflow-hidden cursor-pointer"
    >
      <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden flex-shrink-0 border border-white/5">
        <img 
          src={event.coverImage || `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=200&q=80`} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
          alt="Event"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-full bg-[#B175FF]/10 text-[#B175FF] text-[8px] font-bold uppercase tracking-widest">
            {event.eventType || 'public'}
          </span>
        </div>
        <h4 className="text-white text-lg font-light italic group-hover:text-[#B175FF] transition-colors truncate">
          {event.title}
        </h4>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex flex-col">
            <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest">date</span>
            <span className="text-[10px] text-zinc-400 font-medium tracking-tight">
              {formatDate(event.eventTimestamp || event.date)}
            </span>
          </div>
          <div className="flex flex-col border-l border-white/5 pl-4">
            <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest">status</span>
            <span className="text-[10px] text-zinc-400 font-medium tracking-tight uppercase">
              {event.attendees?.length || 0} attending
            </span>
          </div>
        </div>
      </div>

      {isOwner && (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 pr-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(event.id);
            }}
            title="Delete event"
            className="p-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-2xl transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default memo(EventMiniCardContent);
