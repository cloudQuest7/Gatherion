'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { useDashboardData } from '@/hooks/useDashboardData';
import CreateEventModal from '@/components/modals/CreateEventModal';
import EventMiniCard from '@/components/dashboard/EventMiniCard';
import { Timestamp } from 'firebase/firestore';

export default function MyEventsPage() {
  const { events, loading, refreshData } = useDashboardData();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const myEvents = events.filter(e => e.creatorId === auth.currentUser?.uid);
  const attendingEvents = events.filter(e => e.attendees?.includes(auth.currentUser?.uid || ''));

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
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase();
    } catch {
      return 'TBA';
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteDoc(doc(db, 'events', eventId));
      refreshData();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-2 italic tracking-tight">my events</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">events you&apos;ve created or are attending</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-white text-black px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>create event</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#B175FF]">Hosting</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-[#B175FF]/20 to-transparent" />
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-32 bg-zinc-900/40 animate-pulse rounded-[2rem]" />
                ))}
              </div>
            ) : myEvents.length === 0 ? (
              <div className="p-16 border border-dashed border-white/5 rounded-[2.5rem] text-center bg-zinc-950/20 backdrop-blur-sm">
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest italic">you haven&apos;t created any events yet</p>
              </div>
            ) : (
              myEvents.map(event => (
                <EventMiniCard 
                  key={event.id} 
                  event={event} 
                  formatDate={formatDate} 
                  isOwner={true}
                  onDelete={handleDeleteEvent}
                />
              ))
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500">Attending</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-32 bg-zinc-900/40 animate-pulse rounded-[2rem]" />
                ))}
              </div>
            ) : attendingEvents.length === 0 ? (
              <div className="p-16 border border-dashed border-white/5 rounded-[2.5rem] text-center bg-zinc-950/20 backdrop-blur-sm">
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest italic">you aren&apos;t attending any events yet</p>
              </div>
            ) : (
              attendingEvents.map(event => (
                <EventMiniCard 
                  key={event.id} 
                  event={event} 
                  formatDate={formatDate} 
                />
              ))
            )}
          </div>
        </div>
      </div>

      <CreateEventModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={refreshData}
      />
    </motion.div>
  );
}
