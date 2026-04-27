'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Bell, 
  Settings,
  PlusCircle,
  X 
} from 'lucide-react';
import { auth } from '@/lib/firebase';

const sidebarItems = [
  { id: 'dashboard', name: 'dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'create', name: 'create event', icon: PlusCircle, href: '/dashboard/create' },
  { id: 'my-events', name: 'my events', icon: Calendar, href: '/dashboard/my-events' },
  { id: 'guests', name: 'guests', icon: Users, href: '/dashboard/guests' },
  { id: 'notifications', name: 'notifications', icon: Bell, href: '/dashboard/notifications' },
  { id: 'settings', name: 'settings', icon: Settings, href: '/dashboard/settings' },
];

export default function DashboardSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-12 px-2">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <span className="text-xl font-light tracking-tight text-white italic">Gatherion.</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 text-zinc-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.id} href={item.href} onClick={onClose}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 relative group mb-2 ${
                  isActive 
                    ? 'bg-[#B175FF] text-black font-bold shadow-lg shadow-[#B175FF]/20' 
                    : 'text-zinc-500 hover:text-[#B175FF] hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-black' : 'group-hover:text-[#B175FF]'}`} />
                <span className="text-sm tracking-widest uppercase font-bold text-[10px]">{item.name}</span>
                {item.id === 'notifications' && !isActive && (
                  <span className="absolute right-4 w-2 h-2 bg-[#B175FF] rounded-full shadow-[0_0_10px_rgba(177,117,255,0.5)]" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500 border border-white/10">
            {auth.currentUser?.displayName?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-white truncate uppercase tracking-widest">
              {auth.currentUser?.displayName || 'User'}
            </p>
            <p className="text-[8px] text-zinc-500 truncate uppercase tracking-tighter">
              {auth.currentUser?.email || 'Settings'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
