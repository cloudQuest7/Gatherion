'use client';

import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  Plus, 
  Calendar,
  Users,
  Activity as ActivityIcon
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { useDashboardData } from '@/hooks/useDashboardData';
import EventMiniCard from '@/components/dashboard/EventMiniCard';
import CreateEventModal from '@/components/modals/CreateEventModal';
import { Timestamp } from 'firebase/firestore';
import { useState } from 'react';

export default function DashboardOverview() {
  const { events, guests, activities, loading, user, refreshData } = useDashboardData();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const userName = user?.displayName?.split(' ')[0] || 'friend';

  const myEvents = events.filter(e => e.creatorId === user?.uid);
  const attendingEvents = events.filter(e => e.attendees?.includes(user?.uid || ''));

  const formatDate = (date: any) => {
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
    } catch (e) {
      return 'TBA';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* --- Header --- */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight italic">
            welcome back, <span className="text-[#B175FF] font-normal">{userName}</span>
          </h1>
          <p className="text-zinc-500 text-base md:text-lg font-light max-w-xl leading-relaxed">
            you have <span className="text-white font-medium">{myEvents.length + attendingEvents.length} upcoming events</span> and {guests.length} guests waiting for you.
          </p>
        </div>
        <Link href="/dashboard/create">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-3 hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 w-full md:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>create new event</span>
          </motion.button>
        </Link>
      </header>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { label: 'total events', value: myEvents.length + attendingEvents.length, icon: Calendar, color: 'text-[#B175FF]', bg: 'bg-[#B175FF]/10' },
          { label: 'confirmed guests', value: guests.length, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'recent updates', value: activities.length, icon: ActivityIcon, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-4 group hover:bg-zinc-900/60 transition-all"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-1">{stat.label}</p>
              <p className="text-4xl font-light text-white italic">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- Main Dashboard Content --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column: Events */}
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500">Upcoming Events</h3>
            <Link href="/dashboard/my-events" className="text-[10px] uppercase tracking-widest text-[#B175FF] hover:text-[#B175FF]/80 flex items-center gap-1 transition-colors">
              view all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-white/5 rounded-[2rem] animate-pulse" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="p-20 border border-dashed border-white/10 rounded-[3rem] text-center bg-white/[0.02]">
                <p className="text-zinc-500 text-sm italic mb-6">your event calendar is currently empty</p>
                <Link href="/dashboard/create">
                  <button className="text-[10px] uppercase tracking-widest text-white border border-white/10 px-10 py-5 rounded-full hover:bg-white/5 transition-all font-bold">
                    create your first event
                  </button>
                </Link>
              </div>
            ) : (
              events.slice(0, 4).map(event => (
                <EventMiniCard key={event.id} event={event} formatDate={formatDate} />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="space-y-10">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-500">Recent Activity</h3>
            <Link href="/dashboard/notifications" className="text-[10px] uppercase tracking-widest text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors font-bold">
              view all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[3rem] space-y-10">
            {loading ? (
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold animate-pulse">loading activity...</p>
            ) : activities.length === 0 ? (
              <p className="text-zinc-500 text-sm italic text-center py-4">no recent activity to show</p>
            ) : (
              activities.slice(0, 5).map((activity, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className={`w-1 h-12 rounded-full shrink-0 transition-all ${
                    activity.type === 'rsvp' ? 'bg-[#B175FF]/20 group-hover:bg-[#B175FF]' : 'bg-indigo-500/20 group-hover:bg-indigo-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-zinc-300 leading-snug">
                      <span className="text-white font-bold">{activity.user}</span> {activity.action} <span className="text-[#B175FF] font-medium italic">{activity.target}</span>
                    </p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-2">{activity.time}</p>
                  </div>
                </div>
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
