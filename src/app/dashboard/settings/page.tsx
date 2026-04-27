'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Mail, Shield, LogOut } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser || !displayName.trim()) return;
    setIsUpdatingProfile(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        displayName: displayName
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-12 pb-20"
    >
      <div>
        <h2 className="text-4xl md:text-5xl font-light text-white mb-2 italic tracking-tight">settings</h2>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Section */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#B175FF]/10 rounded-2xl">
              <User className="w-6 h-6 text-[#B175FF]" />
            </div>
            <h3 className="text-2xl font-light italic text-white">profile information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 ml-4">Display Name</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#B175FF]/50 transition-all placeholder:text-zinc-700"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 ml-4">Email Address</label>
              <div className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-zinc-500 flex items-center gap-3 italic">
                <Mail className="w-4 h-4" />
                <span className="truncate">{auth.currentUser?.email}</span>
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpdateProfile}
            disabled={isUpdatingProfile}
            className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isUpdatingProfile ? 'saving...' : 'save changes'}</span>
          </motion.button>
        </div>

        {/* Security & Account */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-zinc-800 rounded-2xl">
              <Shield className="w-6 h-6 text-zinc-400" />
            </div>
            <h3 className="text-2xl font-light italic text-white">security & account</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              className="w-full sm:w-auto bg-zinc-900/50 border border-white/5 text-white px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>sign out</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
