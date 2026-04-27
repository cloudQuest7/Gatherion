'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Background from '@/components/layout/Background';
import DashboardSidebar from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row selection:bg-[#B175FF]/30 overflow-hidden">
      <Background />
      
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-6 bg-black/40 backdrop-blur-xl border-b border-white/5 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#B175FF] rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full" />
          </div>
          <span className="text-xl font-light tracking-tight text-white italic">soul.</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 border-r border-white/5 bg-zinc-950/20 backdrop-blur-xl p-8 z-20 h-screen sticky top-0">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[40] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-zinc-950 border-r border-white/10 p-8 z-[50] lg:hidden"
            >
              <DashboardSidebar onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 p-6 md:p-12 lg:p-16 z-10 overflow-y-auto h-screen custom-scrollbar relative">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
