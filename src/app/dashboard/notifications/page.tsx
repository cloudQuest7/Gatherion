'use client';

import { motion } from 'framer-motion';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function NotificationsPage() {
  const { activities, loading } = useDashboardData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <div>
        <h2 className="text-4xl font-light text-white mb-2 italic">notifications</h2>
        <p className="text-zinc-500 text-sm">stay updated with your events and community</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-zinc-500 text-sm animate-pulse">loading notifications...</p>
        ) : activities.length === 0 ? (
          <div className="p-20 border border-dashed border-white/10 rounded-[3rem] text-center">
            <p className="text-zinc-500 text-sm italic">all caught up! no new notifications</p>
          </div>
        ) : (
          activities.map((activity, i) => (
            <motion.div 
              key={activity.id + i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 group hover:bg-zinc-900/60 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                activity.type === 'rsvp' ? 'bg-purple-500/10' : 'bg-indigo-500/10'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'rsvp' ? 'bg-purple-400' : 'bg-indigo-400'
                }`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-zinc-300">
                  <span className="text-white font-medium">{activity.user}</span> {activity.action} <span className="text-purple-300 font-medium italic">{activity.target}</span>
                </p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{activity.time}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
