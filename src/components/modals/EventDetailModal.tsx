'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check, MapPin, Calendar, Users, Lock, Link as LinkIcon } from 'lucide-react';
import { DashboardEvent } from '@/hooks/useDashboardData';
import { Timestamp } from 'firebase/firestore';

interface EventDetailModalProps {
  isOpen: boolean;
  event: DashboardEvent | null;
  onClose: () => void;
}

export default function EventDetailModal({ isOpen, event, onClose }: EventDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<'link' | 'image' | null>(null);

  if (!event) return null;

  const eventUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/event/${event.id}`;

  const formatDate = (date: Timestamp | string | Date | null | undefined): string => {
    try {
      if (!date) return 'TBA';
      let d: Date;
      if (date instanceof Timestamp) {
        d = date.toDate();
      } else if (typeof date === 'string') {
        d = new Date(date);
      } else {
        d = date;
      }
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return 'TBA';
    }
  };

  const formatTime = (time: string) => {
    if (!time) return 'TBA';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform: string) => {
    const text = `Check out this event: ${event.title}`;
    let url = '';
    
    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(eventUrl)}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`;
    } else if (platform === 'whatsapp') {
      url = `https://wa.me/?text=${encodeURIComponent(`${text} ${eventUrl}`)}`;
    }
    
    if (url) window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl bg-zinc-900 border border-white/5 rounded-[3rem] overflow-hidden relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header with Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <Image
                src={event.coverImage || `https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80`}
                alt={event.title}
                fill
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
              
              {event.isPrivate && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur px-4 py-2 rounded-full">
                  <Lock className="w-4 h-4 text-yellow-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400">Private Event</span>
                </div>
              )}
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 md:p-10 space-y-8">
              {/* Title & Category */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#B175FF]/10 text-[#B175FF] text-[8px] font-bold uppercase tracking-widest">
                    {event.category || 'event'}
                  </span>
                  {event.maxAttendees && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-bold uppercase tracking-widest">
                      {event.attendees?.length || 0} / {event.maxAttendees} attending
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-light italic text-white tracking-tight">
                  {event.title}
                </h1>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900/60 border border-white/5 p-6 rounded-[2rem] space-y-2">
                  <div className="flex items-center gap-2 text-[#B175FF]">
                    <Calendar className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date & Time</span>
                  </div>
                  <p className="text-lg text-white font-light italic">{formatDate(event.eventTimestamp || event.date)}</p>
                  <p className="text-sm text-zinc-400">{formatTime(event.time)}</p>
                </div>

                <div className="bg-zinc-900/60 border border-white/5 p-6 rounded-[2rem] space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <MapPin className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Location</span>
                  </div>
                  <p className="text-lg text-white font-light italic">{event.location}</p>
                </div>

                <div className="md:col-span-2 bg-zinc-900/60 border border-white/5 p-6 rounded-[2rem] space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Users className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Description</span>
                  </div>
                  <p className="text-white leading-relaxed">{event.description}</p>
                </div>
              </div>

              {/* Share Section */}
              <div className="border-t border-white/5 pt-8 space-y-6">
                <h3 className="text-xl font-light italic text-white">Share this event</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Share Link */}
                  <motion.button
                    whileHover={{ y: -2 }}
                    onClick={() => setShareMethod('link')}
                    className="bg-zinc-900/60 border border-white/5 hover:border-[#B175FF]/50 p-6 rounded-[2rem] transition-all space-y-3 group"
                  >
                    <LinkIcon className="w-6 h-6 text-[#B175FF] group-hover:scale-110 transition-transform" />
                    <p className="text-white font-light italic">Copy Link</p>
                    <p className="text-[10px] text-zinc-500">Share event URL</p>
                  </motion.button>

                  {/* Share Card */}
                  <motion.button
                    whileHover={{ y: -2 }}
                    onClick={() => setShareMethod('image')}
                    className="bg-zinc-900/60 border border-white/5 hover:border-[#B175FF]/50 p-6 rounded-[2rem] transition-all space-y-3 group"
                  >
                    <Share2 className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <p className="text-white font-light italic">Share Card</p>
                    <p className="text-[10px] text-zinc-500">Social media preview</p>
                  </motion.button>
                </div>

                {/* Link Share UI */}
                {shareMethod === 'link' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#B175FF]/10 border border-[#B175FF]/30 p-6 rounded-[2rem] space-y-4"
                  >
                    <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl px-4 py-3">
                      <input 
                        type="text" 
                        value={eventUrl} 
                        readOnly 
                        title="Event URL"
                        placeholder="Event URL"
                        className="flex-1 bg-transparent text-white text-sm focus:outline-none truncate"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2 bg-[#B175FF] hover:bg-[#B175FF]/80 text-white rounded-lg transition-all"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span className="text-[10px] font-bold">{copied ? 'Copied!' : 'Copy'}</span>
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {['twitter', 'facebook', 'whatsapp'].map((platform) => (
                        <motion.button
                          key={platform}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => shareToSocial(platform)}
                          className="py-3 px-4 bg-black/40 hover:bg-white/5 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest transition-all"
                          title={`Share on ${platform}`}
                        >
                          {platform}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Card Share UI */}
                {shareMethod === 'image' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-indigo-500/10 border border-indigo-500/30 p-6 rounded-[2rem] space-y-4"
                  >
                    <div className="bg-gradient-to-br from-[#B175FF] to-indigo-600 p-6 rounded-[2rem] text-white space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Event Preview</p>
                      <div className="space-y-3">
                        <h2 className="text-2xl font-light italic">{event.title}</h2>
                        <div className="space-y-2 text-sm opacity-90">
                          <p>📅 {formatDate(event.eventTimestamp || event.date)}</p>
                          <p>📍 {event.location}</p>
                          <p>🕐 {formatTime(event.time)}</p>
                        </div>
                      </div>
                      <p className="text-[10px] opacity-70 italic">Join us for an unforgettable experience</p>
                    </div>
                    <p className="text-[10px] text-zinc-500 text-center italic">Right-click to save and share on social media</p>
                  </motion.div>
                )}
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                Close Details
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
