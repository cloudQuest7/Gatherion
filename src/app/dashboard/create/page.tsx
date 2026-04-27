'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  FileText, 
  Ticket, 
  Users, 
  UserCheck, 
  Sparkles, 
  Check, 
  Copy, 
  Share2,
  ArrowRight,
  X
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Theme, MockEventData } from '@/types';
import PopupModal from '@/components/common/PopupModal';
import CapacityModal from '@/components/modals/CapacityModal';
import { springTransition } from '@/lib/animations';
import { compressImage } from '@/lib/imageUtils';

const themes: Theme[] = [
  { name: 'minimal', color: 'bg-white', bgColor: 'bg-zinc-900/50' },
  { name: 'cosmic', color: 'bg-gradient-to-r from-purple-500 to-indigo-500', bgColor: 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50' },
  { name: 'forest', color: 'bg-gradient-to-r from-green-500 to-emerald-500', bgColor: 'bg-gradient-to-br from-green-900/50 to-emerald-900/50' },
  { name: 'ocean', color: 'bg-gradient-to-r from-blue-500 to-cyan-500', bgColor: 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50' },
  { name: 'sunset', color: 'bg-gradient-to-r from-orange-500 to-pink-500', bgColor: 'bg-gradient-to-br from-orange-900/50 to-pink-900/50' },
  { name: 'neon', color: 'bg-gradient-to-r from-pink-500 to-yellow-500', bgColor: 'bg-gradient-to-br from-pink-900/50 to-yellow-900/50' }
];

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ id: string; title: string } | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Modal states
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);
  const [locationInput, setLocationInput] = useState('');

  const [mockEventData, setMockEventData] = useState<MockEventData>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '18:00',
    endTime: '22:00',
    location: '',
    description: '',
    isPublic: true,
    theme: 'minimal',
    coverImage: null,
    capacity: 'Unlimited',
    requireApproval: false,
    ticketType: 'Free'
  });

  // Automatically redirect after success
  useEffect(() => {
    if (successData) {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 5000); // Give them 5 seconds to copy the link or see the card
      return () => clearTimeout(timer);
    }
  }, [successData, router]);

  const handleCreateEvent = async () => {
    console.log('Attempting to create event...', mockEventData);
    if (!auth.currentUser) {
      console.error('No user logged in');
      alert('You must be logged in to create an event. Please log in and try again.');
      router.push('/login');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Parsing date:', `${mockEventData.date}T${mockEventData.startTime}`);
      const dateObj = new Date(`${mockEventData.date}T${mockEventData.startTime}`);
      
      if (isNaN(dateObj.getTime())) {
        console.error('Invalid date object created');
        throw new Error('Invalid date or time');
      }

      let compressedCoverImage = mockEventData.coverImage;
      if (compressedCoverImage && compressedCoverImage.startsWith('data:image')) {
        console.log('Compressing cover image...');
        compressedCoverImage = await compressImage(compressedCoverImage);
      }
      
      const eventData = {
        title: mockEventData.title || 'Untitled Event',
        description: mockEventData.description,
        date: mockEventData.date,
        time: mockEventData.startTime,
        endTime: mockEventData.endTime,
        location: mockEventData.location || 'Location TBD',
        capacity: mockEventData.capacity,
        maxAttendees: mockEventData.capacity === 'Unlimited' ? null : parseInt(mockEventData.capacity),
        coverImage: compressedCoverImage,
        eventType: mockEventData.isPublic ? 'public' : 'private',
        isPrivate: !mockEventData.isPublic,
        category: 'social',
        theme: mockEventData.theme,
        requireApproval: mockEventData.requireApproval,
        ticketType: mockEventData.ticketType,
        creatorId: auth.currentUser.uid,
        creatorName: auth.currentUser.displayName || 'Anonymous',
        createdAt: Timestamp.now(),
        attendees: [],
        eventTimestamp: Timestamp.fromDate(dateObj)
      };

      console.log('Saving to Firestore:', eventData);
      const docRef = await addDoc(collection(db, 'events'), eventData);
      console.log('Event created with ID:', docRef.id);
      setSuccessData({ id: docRef.id, title: eventData.title });
    } catch (error) {
      console.error('Error creating event:', error);
      alert(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!successData) return;
    const url = `${window.location.origin}/event/${successData.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (successData) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto py-8 md:py-12 px-4 text-center space-y-12"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-20 h-20 md:w-24 md:h-24 bg-[#B175FF] rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-[#B175FF]/20"
          >
            <Check className="w-10 h-10 md:w-12 md:h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-light text-white italic tracking-tight">event launched!</h1>
          <p className="text-zinc-500 text-base md:text-lg">your vibrant gathering is ready to be shared with the world.</p>
        </div>

        {/* The Cool Cozy Vibrant Card */}
        <div className="relative group max-w-md mx-auto w-full">
          <motion.div 
            animate={{ 
              scale: [1, 1.02, 1],
              rotate: [0, 1, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-gradient-to-r from-[#B175FF] via-indigo-600 to-[#B175FF] rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" 
          />
          <div className="relative bg-zinc-900/80 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[3rem] text-left space-y-6 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-16 h-16 md:w-24 md:h-24 text-white" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#B175FF] rounded-full animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500">Official Invitation</span>
              </div>
              <Sparkles className="w-5 h-5 text-[#B175FF]" />
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              {successData.title}
            </h3>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-zinc-400">
                <Calendar className="w-4 h-4 text-[#B175FF]" />
                <span className="text-sm font-medium">{mockEventData.date} • {mockEventData.startTime}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium truncate">{mockEventData.location || 'Secret Location'}</span>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                    ?
                  </div>
                ))}
              </div>
              <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                {mockEventData.ticketType}
              </div>
            </div>
          </div>
        </div>

        {/* Share Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-full flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs transition-all shadow-xl shadow-white/5"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? 'Link Copied!' : 'Copy Event Link'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto bg-zinc-900 border border-white/10 text-white px-10 py-5 rounded-full flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs transition-all hover:bg-zinc-800"
          >
            <Share2 className="w-4 h-4" />
            Share Card
          </motion.button>
        </div>

        <button 
          onClick={() => router.push('/dashboard')}
          className="text-zinc-500 hover:text-[#B175FF] text-[10px] uppercase tracking-[0.4em] font-bold transition-colors pt-8"
        >
          Back to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-light text-white italic tracking-tight">create event</h1>
        <p className="text-zinc-500 text-base md:text-lg font-light max-w-2xl leading-relaxed">
          design a unique experience for your guests. choose a theme, set the vibe, and launch your gathering.
        </p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column - Image & Theme */}
        <div className="space-y-8 order-2 lg:order-1">
          {/* Image Upload Area */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-6 md:p-8">
            <div
              onClick={() => document.getElementById('mockCoverImageInput')?.click()}
              className="aspect-square rounded-[2rem] bg-black/40 border-2 border-dashed border-white/10 flex flex-col items-center justify-center hover:border-[#B175FF]/50 transition-all cursor-pointer group relative overflow-hidden"
            >
              {mockEventData?.coverImage ? (
                <>
                  <img
                    src={mockEventData.coverImage}
                    alt="Event cover"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <p className="text-white text-xs font-bold uppercase tracking-widest">Change Image</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#B175FF]/20 transition-colors">
                    <Plus className="w-8 h-8 text-zinc-500 group-hover:text-[#B175FF] transition-colors" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                    Upload Cover Image
                  </p>
                </div>
              )}
            </div>
            <input
              id="mockCoverImageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setMockEventData(prev => ({
                      ...prev,
                      coverImage: reader.result as string
                    }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          {/* Theme Selector */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-6 md:p-8">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 mb-6 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-[#B175FF] rounded-full animate-pulse" />
              Select Theme
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setMockEventData(prev => ({ ...prev, theme: theme.name }))}
                  className={`p-3 rounded-2xl border transition-all relative overflow-hidden group ${
                    mockEventData?.theme === theme.name
                      ? 'border-[#B175FF] bg-[#B175FF]/10'
                      : 'border-white/5 bg-black/20 hover:border-white/20'
                  }`}
                >
                  <div className={`w-full h-12 rounded-xl ${theme.color} mb-2 opacity-80 group-hover:opacity-100 transition-opacity`} />
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${
                    mockEventData?.theme === theme.name ? 'text-[#B175FF]' : 'text-zinc-500'
                  }`}>
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Event Details */}
        <div className={`lg:col-span-2 backdrop-blur-3xl rounded-[3rem] border border-white/10 transition-all duration-700 shadow-2xl overflow-hidden order-1 lg:order-2 ${
          themes.find(t => t.name === mockEventData.theme)?.bgColor || 'bg-zinc-900/40'
        }`}>
          <div className="p-6 md:p-12 space-y-12">
            {/* Event Name */}
            <div className="relative">
              <input
                type="text"
                placeholder="Name your event..."
                value={mockEventData.title}
                onChange={(e) => setMockEventData(prev => ({ 
                  ...prev, 
                  title: e.target.value 
                }))}
                className="w-full text-4xl md:text-6xl font-bold text-white bg-transparent placeholder-white/10 focus:outline-none tracking-tight italic"
              />
              <motion.div 
                className="absolute -bottom-4 left-0 h-[1px] bg-gradient-to-r from-[#B175FF] to-transparent"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5 }}
              />
            </div>

            {/* Date Time Section */}
            <div className="bg-black/20 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 border border-white/5 space-y-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#B175FF]" />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500">Schedule</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 ml-1">Starts</label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="date"
                      value={mockEventData.date}
                      onChange={(e) => setMockEventData(prev => ({
                        ...prev,
                        date: e.target.value
                      }))}
                      className="w-full sm:flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-xs focus:outline-none focus:border-[#B175FF]/50 transition-all"
                    />
                    <input
                      type="time"
                      value={mockEventData.startTime}
                      onChange={(e) => setMockEventData(prev => ({
                        ...prev,
                        startTime: e.target.value
                      }))}
                      className="w-full sm:w-32 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-xs focus:outline-none focus:border-[#B175FF]/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 ml-1">Ends</label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="date"
                      value={mockEventData.date}
                      className="w-full sm:flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-xs focus:outline-none opacity-50 cursor-not-allowed"
                      disabled
                    />
                    <input
                      type="time"
                      value={mockEventData.endTime}
                      onChange={(e) => setMockEventData(prev => ({
                        ...prev,
                        endTime: e.target.value
                      }))}
                      className="w-full sm:w-32 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white text-xs focus:outline-none focus:border-[#B175FF]/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setIsLocationModalOpen(true)}
                className="bg-black/20 backdrop-blur-md rounded-[2rem] p-6 border border-white/5 cursor-pointer hover:bg-black/40 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-[#B175FF]/10 text-[#B175FF] group-hover:bg-[#B175FF]/20 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 mb-1">Location</div>
                    <div className="text-sm text-zinc-300 truncate font-medium">
                      {mockEventData.location || "Add location or link"}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setIsDescriptionModalOpen(true)}
                className="bg-black/20 backdrop-blur-md rounded-[2rem] p-6 border border-white/5 cursor-pointer hover:bg-black/40 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 mb-1">Description</div>
                    <div className="text-sm text-zinc-300 truncate font-medium">
                      {mockEventData.description || "Add event details"}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Event Options */}
            <div className="space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 mb-6">Event Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setMockEventData(prev => ({
                    ...prev,
                    ticketType: prev.ticketType === 'Free' ? 'Paid' : 'Free'
                  }))}
                  className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5 cursor-pointer hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Ticket className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs text-zinc-400 font-medium">Tickets</span>
                  </div>
                  <span className="text-xs text-white font-bold">{mockEventData.ticketType}</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setIsCapacityModalOpen(true)}
                  className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5 cursor-pointer hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs text-zinc-400 font-medium">Capacity</span>
                  </div>
                  <span className="text-xs text-white font-bold">{mockEventData.capacity}</span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setMockEventData(prev => ({
                    ...prev,
                    requireApproval: !prev.requireApproval
                  }))}
                  className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5 cursor-pointer hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs text-zinc-400 font-medium">Approval</span>
                  </div>
                  <div className={`w-8 h-4 rounded-full transition-colors relative ${
                    mockEventData.requireApproval ? 'bg-purple-500' : 'bg-zinc-800'
                  }`}>
                    <motion.div
                      animate={{ x: mockEventData.requireApproval ? 18 : 2 }}
                      className="absolute top-1 w-2 h-2 bg-white rounded-full"
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Launch Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || !mockEventData.title}
              onClick={handleCreateEvent}
              className="w-full bg-white text-black py-6 rounded-[2rem] font-bold uppercase tracking-[0.3em] text-sm shadow-2xl shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4"
            >
              {loading ? 'Launching...' : 'Launch Event'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* --- Modals --- */}
      <CapacityModal 
        isOpen={isCapacityModalOpen}
        onClose={() => setIsCapacityModalOpen(false)}
        mockEventData={mockEventData}
        setMockEventData={setMockEventData}
      />

      {/* Description Modal */}
      <PopupModal 
        isOpen={isDescriptionModalOpen} 
        onClose={() => setIsDescriptionModalOpen(false)}
        title="Add Description"
      >
        <div className="space-y-6">
          <textarea 
            value={mockEventData.description}
            onChange={(e) => setMockEventData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-6 py-4 bg-zinc-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-500 transition-all text-sm"
            placeholder="Tell us more about the vibe..."
            rows={6}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDescriptionModalOpen(false)}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold uppercase tracking-widest text-xs"
          >
            Save Vibe
          </motion.button>
        </div>
      </PopupModal>

      {/* Location Modal */}
      <PopupModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        title="Add Location"
      >
        <div className="space-y-6">
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            className="w-full px-6 py-4 bg-zinc-900 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-500 transition-all text-sm"
            placeholder="Enter location or meeting link"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setMockEventData(prev => ({ ...prev, location: locationInput }));
              setIsLocationModalOpen(false);
            }}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold uppercase tracking-widest text-xs"
          >
            Save Location
          </motion.button>
        </div>
      </PopupModal>
    </div>
  );
}
