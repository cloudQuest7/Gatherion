'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, Calendar, MapPin, AlignLeft, Type, Shield, Users, Check, Copy, Share2, Sparkles, ArrowRight } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateEventModal({ isOpen, onClose, onSuccess }: CreateEventModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ id: string; title: string } | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'social',
    isPrivate: false,
    maxAttendees: ''
  });

  const handleClose = useCallback(() => {
    setSuccessData(null);
    setError(null);
    setLoading(false);
    onClose();
  }, [onClose]);

  // Automatically redirect after success
  useEffect(() => {
    if (successData && successData.id !== 'creating...') {
      const timer = setTimeout(() => {
        handleClose();
        router.push('/dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successData, router, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!auth.currentUser) {
      setError('You must be logged in to create an event');
      return;
    }

    if (!formData.title.trim()) {
      setError('Event title is required');
      return;
    }

    if (!formData.date || !formData.time) {
      setError('Date and time are required');
      return;
    }

    if (!formData.location.trim()) {
      setError('Location is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dateObj = new Date(`${formData.date}T${formData.time}`);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date and time');
      }

      const eventData = {
        ...formData,
        eventType: formData.isPrivate ? 'private' : 'public',
        creatorId: auth.currentUser.uid,
        creatorName: auth.currentUser.displayName || 'Anonymous',
        createdAt: Timestamp.now(),
        attendees: [],
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        eventTimestamp: Timestamp.fromDate(dateObj)
      };

      // Show optimistic success screen
      setSuccessData({ id: 'creating...', title: formData.title });

      // Create event with timeout protection
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );

      const createPromise = addDoc(collection(db, 'events'), eventData);
      
      const docRef = await Promise.race([createPromise, timeoutPromise]);
      
      // Update with real ID once created
      setSuccessData({ id: (docRef as any).id, title: formData.title });
      onSuccess?.();

      // Reset form
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        category: 'social',
        isPrivate: false,
        maxAttendees: ''
      });
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to create event. Please try again.');
      setSuccessData(null);
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!successData || successData.id === 'creating...') return;
    const url = `${window.location.origin}/event/${successData.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl bg-zinc-900 border border-white/5 rounded-[3rem] overflow-hidden relative z-10 shadow-2xl"
          >
            {successData ? (
              <div className="p-12 text-center space-y-8 bg-zinc-950/40">
                <div className="flex justify-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-[#B175FF] rounded-full flex items-center justify-center shadow-2xl shadow-[#B175FF]/40"
                  >
                    <Check className="w-12 h-12 text-white" />
                  </motion.div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-light text-white italic tracking-tight">event launched.</h2>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] max-w-xs mx-auto">your masterpiece &quot;{successData.title}&quot; is ready for the world.</p>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center justify-between px-8 py-6 bg-black/40 border border-white/5 rounded-2xl group hover:border-[#B175FF]/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <Share2 className="w-4 h-4 text-zinc-600 group-hover:text-[#B175FF] transition-colors" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Copy Event Link</span>
                    </div>
                    {copied ? <Check className="w-4 h-4 text-[#B175FF]" /> : <Copy className="w-4 h-4 text-zinc-800" />}
                  </button>

                  <div className="pt-4 space-y-4">
                    <button 
                      onClick={() => {
                        handleClose();
                        router.push('/dashboard');
                      }}
                      className="w-full py-6 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:shadow-[0_0_30px_rgba(177,117,255,0.3)] transition-all flex items-center justify-center gap-3"
                    >
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-zinc-700 text-[8px] font-bold uppercase tracking-widest italic animate-pulse">Redirecting in a moment...</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-zinc-950/20">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#B175FF] rounded-full flex items-center justify-center shadow-lg shadow-[#B175FF]/20">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-light text-white italic">create event</h2>
                      <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-600">bring your vision to life</p>
                    </div>
                  </div>
                  <button onClick={handleClose} className="p-3 bg-white/5 rounded-2xl text-zinc-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar bg-black/20">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-4 flex items-center gap-2">
                        <Type className="w-3 h-3" /> Event Title
                      </label>
                      <input
                        required
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#B175FF]/50 transition-all placeholder:text-zinc-800"
                        placeholder="What are we celebrating?"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-4 flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Date
                      </label>
                      <input
                        required
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#B175FF]/50 transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-4 flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Time
                      </label>
                      <input
                        required
                        type="time"
                        value={formData.time}
                        onChange={e => setFormData({...formData, time: e.target.value})}
                        className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#B175FF]/50 transition-all"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-4 flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Location
                      </label>
                      <input
                        required
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#B175FF]/50 transition-all placeholder:text-zinc-800"
                        placeholder="Physical address or virtual link"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-4 flex items-center gap-2">
                        <AlignLeft className="w-3 h-3" /> Description
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-zinc-950/40 border border-white/5 rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-[#B175FF]/50 transition-all placeholder:text-zinc-800 resize-none"
                        placeholder="Tell your guests about the soul of this event..."
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-4 flex items-center gap-2">
                        <Users className="w-3 h-3" /> Max Capacity
                      </label>
                      <input
                        type="number"
                        value={formData.maxAttendees}
                        onChange={e => setFormData({...formData, maxAttendees: e.target.value})}
                        className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#B175FF]/50 transition-all placeholder:text-zinc-800"
                        placeholder="Unlimited"
                      />
                    </div>

                    <div className="flex items-center gap-6 p-6 bg-zinc-950/40 rounded-[2rem] border border-white/5">
                      <div className="p-3 bg-zinc-900 rounded-2xl">
                        <Shield className="w-5 h-5 text-zinc-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white mb-1 italic">Private Event</p>
                        <p className="text-[8px] text-zinc-600 uppercase tracking-tighter">Only guests with the link can join</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, isPrivate: !formData.isPrivate})}
                        className={`w-12 h-6 rounded-full transition-all relative ${formData.isPrivate ? 'bg-[#B175FF]' : 'bg-zinc-800'}`}
                      >
                        <motion.div 
                          animate={{ x: formData.isPrivate ? 26 : 2 }}
                          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="pt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      type="submit"
                      className="w-full bg-white text-black py-6 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(177,117,255,0.3)] transition-all disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Launch Event'}
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
