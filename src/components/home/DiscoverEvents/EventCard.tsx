'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Calendar, MapPin, ArrowRight, Check } from 'lucide-react';
import { Event, UserProfile } from '@/types';
import { fadeInUp } from '@/lib/animations';
import AttendeePreview from './AttendeePreview';

interface EventCardProps {
  event: Event;
  index: number;
  onRsvp: (event: Event) => void;
  attendees: UserProfile[];
  isRsvpd: boolean;
}

const EventCard = ({ event, index, onRsvp, attendees, isRsvpd }: EventCardProps) => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      custom={index}
      whileHover={{ y: -8 }}
      className="group bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#B175FF]/30 transition-all duration-700 relative"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={event.coverImage || '/default-event-cover.jpg'}
          alt={event.title}
          fill
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        <div className="absolute top-6 right-6">
          <span className={`px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-[0.2em] backdrop-blur-md border ${
            event.eventType === 'public' 
              ? 'bg-zinc-900/80 text-white border-white/10' 
              : 'bg-[#B175FF]/20 text-[#B175FF] border-[#B175FF]/30'
          }`}>
            {event.eventType}
          </span>
        </div>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="space-y-3">
          <h3 className="text-2xl font-light text-white italic group-hover:text-[#B175FF] transition-colors duration-500 line-clamp-1">
            {event.title}
          </h3>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest line-clamp-2 min-h-[40px] leading-relaxed">
            {event.description}
          </p>
        </div>
        
        <div className="space-y-3 pt-6 border-t border-white/5">
          <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <Calendar className="w-3.5 h-3.5 mr-3 text-zinc-600 group-hover:text-[#B175FF] transition-colors" />
            <span>{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <MapPin className="w-3.5 h-3.5 mr-3 text-zinc-600 group-hover:text-[#B175FF] transition-colors" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <AttendeePreview attendees={attendees} totalAttendees={event.attendees} />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRsvp(event)}
            disabled={isRsvpd}
            className={`flex items-center justify-center gap-3 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-500 group/btn ${
              isRsvpd 
                ? 'bg-[#B175FF] text-white' 
                : 'bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
            }`}
          >
            {isRsvpd ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Going
              </>
            ) : (
              <>
                RSVP
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isRsvpd && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-4 bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white"
          >
            You are going! 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EventCard;
