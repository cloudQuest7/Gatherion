'use client';

import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import EventCard from './EventCard';
import { Event, UserProfile } from '@/types';

interface DiscoverEventsSectionProps {
  events: Event[];
  onRsvp: (event: Event) => void;
  eventAttendees: Record<string, UserProfile[]>;
  rsvpdEvents: string[];
}

const DiscoverEventsSection = ({ events, onRsvp, eventAttendees, rsvpdEvents }: DiscoverEventsSectionProps) => {
  return (
    <section id="discover" className="py-32 relative z-10 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-light text-white italic tracking-tight">explore.</h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">curated gatherings for the curious</p>
            </motion.div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:w-80">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#B175FF] transition-colors" />
              <input 
                type="text" 
                placeholder="Find your vibe..."
                className="w-full pl-14 pr-6 py-5 bg-zinc-900/40 border border-white/5 rounded-2xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#B175FF]/50 transition-all text-[10px] font-bold uppercase tracking-widest"
              />
            </div>
            <button className="p-5 bg-zinc-900/40 border border-white/5 rounded-2xl text-zinc-500 hover:text-white hover:border-[#B175FF]/30 transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {events.map((event, index) => (
            <EventCard 
              key={event.id} 
              event={event} 
              index={index} 
              onRsvp={onRsvp}
              attendees={eventAttendees[event.id] || []}
              isRsvpd={rsvpdEvents.includes(event.id)}
            />
          ))}
        </div>
        
        {events.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-32 bg-zinc-950/20 rounded-[3rem] border border-dashed border-white/5"
          >
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] italic">the stage is empty. create the first masterpiece.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DiscoverEventsSection;
