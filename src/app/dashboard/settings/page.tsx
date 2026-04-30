'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  User, 
  Mail, 
  Shield, 
  LogOut, 
  Bell,
  Eye,
  Lock,
  Smartphone,
  Globe,
  Trash2,
  Check,
  AlertCircle
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { updateProfile, signOut, deleteUser } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface UserSettings {
  displayName: string;
  emailNotifications: boolean;
  eventReminders: boolean;
  profileVisibility: 'public' | 'private' | 'friends';
  twoFactorEnabled: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [settings, setSettings] = useState<UserSettings>({
    displayName: '',
    emailNotifications: true,
    eventReminders: true,
    profileVisibility: 'public',
    twoFactorEnabled: false
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Load user settings from Firestore
  useEffect(() => {
    const loadSettings = async () => {
      if (!auth.currentUser) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setSettings(prev => ({
            ...prev,
            displayName: data.displayName || auth.currentUser?.displayName || '',
            emailNotifications: data.emailNotifications ?? true,
            eventReminders: data.eventReminders ?? true,
            profileVisibility: data.profileVisibility ?? 'public',
            twoFactorEnabled: data.twoFactorEnabled ?? false
          }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser || !displayName.trim()) return;
    setIsUpdatingProfile(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        displayName: displayName,
        emailNotifications: settings.emailNotifications,
        eventReminders: settings.eventReminders,
        profileVisibility: settings.profileVisibility
      });
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSuccessMessage('Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleToggleSetting = async (key: keyof UserSettings) => {
    if (typeof settings[key] !== 'boolean') return;
    
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));
    
    try {
      await updateDoc(doc(db, 'users', auth.currentUser!.uid), {
        [key]: newValue
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      setSettings(prev => ({ ...prev, [key]: !newValue }));
    }
  };

  const handleProfileVisibilityChange = async (visibility: 'public' | 'private' | 'friends') => {
    setSettings(prev => ({ ...prev, profileVisibility: visibility }));
    try {
      await updateDoc(doc(db, 'users', auth.currentUser!.uid), {
        profileVisibility: visibility
      });
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') return;
    
    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
        router.push('/');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setSuccessMessage('Failed to delete account. Please try again.');
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
      className="max-w-5xl mx-auto space-y-8 pb-20"
    >
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-5xl md:text-6xl font-light text-white italic tracking-tight">settings</h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Manage your account and event preferences</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-[2rem] p-4 flex items-center gap-3 text-emerald-400 text-[10px] font-bold uppercase tracking-widest"
        >
          <Check className="w-5 h-5" />
          {successMessage}
        </motion.div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Profile Information */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-10 space-y-8 hover:border-white/10 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#B175FF]/10 rounded-2xl">
              <User className="w-6 h-6 text-[#B175FF]" />
            </div>
            <div>
              <h3 className="text-2xl font-light italic text-white">Profile Information</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Manage your public profile details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 ml-4 flex items-center gap-2">
                <User className="w-3 h-3" /> Display Name
              </label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#B175FF]/50 transition-all placeholder:text-zinc-700"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 ml-4 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email Address
              </label>
              <div className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-zinc-500 flex items-center gap-3 italic">
                <Mail className="w-4 h-4" />
                <span className="truncate">{email}</span>
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
            <span>{isUpdatingProfile ? 'Saving...' : 'Save Changes'}</span>
          </motion.button>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-10 space-y-6 hover:border-white/10 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-500/10 rounded-2xl">
              <Bell className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-2xl font-light italic text-white">Notifications</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Control how you receive updates</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive emails about your events and RSVPs' },
              { key: 'eventReminders', label: 'Event Reminders', description: 'Get reminded before your events start' }
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                <div>
                  <p className="text-white font-light">{label}</p>
                  <p className="text-[10px] text-zinc-500">{description}</p>
                </div>
                <button
                  onClick={() => handleToggleSetting(key as keyof UserSettings)}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings[key as keyof UserSettings] ? 'bg-[#B175FF]' : 'bg-zinc-800'}`}
                  title={`Toggle ${label}`}
                >
                  <motion.div 
                    animate={{ x: settings[key as keyof UserSettings] ? 26 : 2 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-10 space-y-6 hover:border-white/10 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl">
              <Eye className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-light italic text-white">Privacy</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Control your profile visibility</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Profile Visibility</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'public', label: 'Public', description: 'Anyone can see your profile' },
                { value: 'friends', label: 'Friends', description: 'Only friends can see' },
                { value: 'private', label: 'Private', description: 'Only you can see' }
              ].map(({ value, label, description }) => (
                <motion.button
                  key={value}
                  whileHover={{ y: -2 }}
                  onClick={() => handleProfileVisibilityChange(value as 'public' | 'friends' | 'private')}
                  className={`p-4 rounded-2xl border transition-all text-left ${
                    settings.profileVisibility === value
                      ? 'bg-[#B175FF]/10 border-[#B175FF]/50'
                      : 'bg-black/20 border-white/5 hover:border-white/10'
                  }`}
                >
                  <p className="text-white font-light mb-1">{label}</p>
                  <p className="text-[10px] text-zinc-500">{description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-10 space-y-6 hover:border-white/10 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-500/10 rounded-2xl">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-2xl font-light italic text-white">Security</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Manage your account security</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-white font-light">Two-Factor Authentication</p>
                    <p className="text-[10px] text-zinc-500">Add an extra layer of security</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Coming Soon</span>
              </div>
            </div>

            <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-light">Active Sessions</p>
                    <p className="text-[10px] text-zinc-500">View and manage your active sessions</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">1 Session</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-10 space-y-6 hover:border-white/10 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 bg-red-500/10 rounded-2xl">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-2xl font-light italic text-white">Account & Sessions</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Manage your account access</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              className="flex-1 bg-zinc-900/50 border border-white/5 text-white px-8 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex-1 bg-zinc-900/50 border border-white/5 text-white px-8 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-zinc-900 border border-white/5 rounded-[2rem] p-8 max-w-md space-y-6"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-2xl font-light italic text-white">Delete Account</h3>
            </div>

            <p className="text-zinc-400 text-sm">This action cannot be undone. All your events and data will be permanently deleted.</p>

            <input 
              type="text" 
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-500/50 transition-all"
            />

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeleteConfirmation('');
                }}
                className="flex-1 py-3 bg-zinc-900/50 hover:bg-zinc-900 text-white rounded-full border border-white/5 text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE'}
                className="flex-1 py-3 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full border border-red-500/30 text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Account
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
