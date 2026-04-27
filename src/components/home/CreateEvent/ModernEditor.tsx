'use client';

import { motion } from 'framer-motion';
import { Plus, Calendar, MapPin, FileText, Ticket, Users, UserCheck } from 'lucide-react';
import { MockEventData, Theme, Event, Notification } from '@/types';
import { springTransition } from '@/lib/animations';

interface ModernEditorProps {
  mockEventData: MockEventData;
  setMockEventData: React.Dispatch<React.SetStateAction<MockEventData>>;
  themes: Theme[];
  setIsLocationModalOpen: (isOpen: boolean) => void;
  setIsDescriptionModalOpen: (isOpen: boolean) => void;
  setIsCapacityModalOpen: (isOpen: boolean) => void;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const ModernEditor = ({
  mockEventData,
  setMockEventData,
  themes,
  setIsLocationModalOpen,
  setIsDescriptionModalOpen,
  setIsCapacityModalOpen,
  setEvents,
  setNotifications
}: ModernEditorProps) => {
  const handleCreateEvent = () => {
    const newEvent: Event = {
      id: Math.random().toString(36).slice(2, 11),
      title: mockEventData.title || 'Untitled Event',
      description: mockEventData.description || 'No description provided',
      date: mockEventData.date,
      time: mockEventData.startTime,
      location: mockEventData.location || 'Location TBD',
      capacity: mockEventData.capacity,
      coverImage: mockEventData.coverImage,
      eventType: mockEventData.isPublic ? 'public' : 'private',
      attendees: 0,
      createdAt: new Date()
    };

    setEvents(prev => [newEvent, ...prev]);

    const notification = {
      id: Math.random().toString(36).slice(2, 11),
      eventId: newEvent.id,
      message: "Event created successfully! 🎉"
    };
    setNotifications(prev => [...prev, notification]);

    setMockEventData({
      title: '',
      date: '2025-05-03',
      startTime: '18:00',
      endTime: '19:00',
      location: '',
      description: '',
      isPublic: true,
      theme: 'minimal',
      coverImage: null,
      capacity: 'Unlimited',
      requireApproval: false,
      ticketType: 'Free'
    });

    setTimeout(() => {
      setNotifications(prev => 
        prev.filter(n => n.id !== notification.id)
      );
    }, 3000);

    document.getElementById('discover')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <motion.div 
      key="mock"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={springTransition}
      className="max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image & Theme */}
        <div className="space-y-6">
          {/* Image Upload Area */}
          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-[2rem] border border-white/5 p-6">
            <div
              onClick={() => document.getElementById('mockCoverImageInput')?.click()}
              className="aspect-square rounded-2xl bg-zinc-950/50 border-2 border-dashed border-white/5 flex flex-col items-center justify-center hover:border-[#B175FF]/30 transition-all cursor-pointer group relative overflow-hidden shadow-inner"
            >
              {mockEventData?.coverImage ? (
                <>
                  <img
                    src={mockEventData.coverImage}
                    alt="Event cover"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <p className="text-white text-[10px] font-bold uppercase tracking-widest">Change image</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center p-6 text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-2xl bg-zinc-900/80 flex items-center justify-center mb-4 border border-white/5 group-hover:bg-[#B175FF]/10 group-hover:border-[#B175FF]/30 transition-colors"
                  >
                    <Plus className="w-8 h-8 text-zinc-500 group-hover:text-[#B175FF] transition-colors" />
                  </motion.div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <span className="text-[#B175FF] group-hover:text-[#B175FF]/80">Upload</span> cover
                    <br /><span className="text-[8px] opacity-40 mt-1 block">max 10MB</span>
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
          <div className="bg-zinc-900/40 backdrop-blur-sm rounded-[2rem] border border-white/5 p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-6 flex items-center">
              <div className="w-1.5 h-4 bg-[#B175FF] rounded-full mr-3" />
              vibe.
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {themes.map((theme) => (
                <motion.button
                  key={theme.name}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMockEventData(prev => ({ ...prev, theme: theme.name }))}
                  className={`p-4 rounded-2xl border transition-all duration-500 relative overflow-hidden group ${
                    mockEventData?.theme === theme.name
                      ? 'border-[#B175FF]/30 bg-[#B175FF]/5 shadow-lg shadow-[#B175FF]/5'
                      : 'border-white/5 bg-zinc-950/50 hover:bg-zinc-900/50 hover:border-white/10'
                  }`}
                >
                  <div className={`w-full h-12 rounded-xl ${theme.color} mb-3 opacity-80 group-hover:opacity-100 transition-opacity`} />
                  <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    mockEventData?.theme === theme.name ? 'text-[#B175FF]' : 'text-zinc-500'
                  }`}>
                    {theme.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Event Details */}
        <div className={`lg:col-span-2 backdrop-blur-xl rounded-[2.5rem] border border-white/5 transition-all duration-1000 overflow-hidden relative ${
          themes.find(t => t.name === mockEventData.theme)?.bgColor || 'bg-zinc-900/40'
        }`}>
          <div className="px-8 py-10 space-y-10 relative z-10">
            {/* Event Name */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Name your event..."
                value={mockEventData.title}
                onChange={(e) => setMockEventData(prev => ({ 
                  ...prev, 
                  title: e.target.value 
                }))}
                className="w-full text-4xl sm:text-5xl md:text-6xl font-light text-white bg-transparent placeholder-white/10 focus:outline-none tracking-tighter italic transition-all"
              />
              <motion.div 
                className="absolute -bottom-2 left-0 h-[1px] bg-gradient-to-r from-[#B175FF] to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>

            {/* Date Time Section */}
            <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/5 space-y-8">
              <div className="flex items-center text-[10px] font-bold text-[#B175FF] uppercase tracking-[0.4em]">
                <Calendar className="w-3.5 h-3.5 mr-3" />
                timing.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Start Time */}
                <div className="space-y-3">
                  <label className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest ml-1">Starts</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      value={mockEventData.date}
                      onChange={(e) => setMockEventData(prev => ({
                        ...prev,
                        date: e.target.value
                      }))}
                      className="flex-1 bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-3 text-zinc-300 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#B175FF]/30 transition-all"
                    />
                    <input
                      type="time"
                      value={mockEventData.startTime}
                      onChange={(e) => setMockEventData(prev => ({
                        ...prev,
                        startTime: e.target.value
                      }))}
                      className="w-32 bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-3 text-zinc-300 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#B175FF]/30 transition-all"
                    />
                  </div>
                </div>

                {/* End Time */}
                <div className="space-y-3">
                  <label className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest ml-1">Ends</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      value={mockEventData.date}
                      onChange={(e) => setMockEventData(prev => ({
                        ...prev,
                        date: e.target.value
                      }))}
                      className="flex-1 bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-3 text-zinc-300 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#B175FF]/30 transition-all"
                    />
                    <input
                      type="time"
                      value={mockEventData.endTime}
                      onChange={(e) => setMockEventData(prev => ({
                        ...prev,
                        endTime: e.target.value
                      }))}
                      className="w-32 bg-zinc-950/50 border border-white/5 rounded-xl px-4 py-3 text-zinc-300 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#B175FF]/30 transition-all"
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
                className="bg-black/20 backdrop-blur-sm rounded-3xl p-6 border border-white/5 cursor-pointer hover:bg-black/40 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-2xl bg-[#B175FF]/10 text-[#B175FF] group-hover:bg-[#B175FF]/20 transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">where.</div>
                    <div className="text-[10px] text-white truncate font-bold uppercase tracking-widest">
                      {mockEventData.location || "Add location or link"}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }}
                onClick={() => setIsDescriptionModalOpen(true)}
                className="bg-black/20 backdrop-blur-sm rounded-3xl p-6 border border-white/5 cursor-pointer hover:bg-black/40 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-2xl bg-[#B175FF]/10 text-[#B175FF] group-hover:bg-[#B175FF]/20 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">details.</div>
                    <div className="text-[10px] text-white truncate font-bold uppercase tracking-widest">
                      {mockEventData.description || "Add event details"}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Event Options */}
            <div className="space-y-4">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] mb-6">access.</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Ticket Type */}
                <motion.div
                  className="flex flex-col p-6 bg-black/20 border border-white/5 rounded-3xl cursor-pointer hover:bg-black/40 transition-all group"
                  whileHover={{ y: -2 }}
                  onClick={() => setMockEventData(prev => ({
                    ...prev,
                    ticketType: prev.ticketType === 'Free' ? 'Paid' : 'Free'
                  }))}
                >
                  <Ticket className="w-4 h-4 text-[#B175FF] mb-3" />
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">tickets</span>
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">{mockEventData.ticketType}</span>
                </motion.div>

                {/* Capacity */}
                <motion.div
                  className="flex flex-col p-6 bg-black/20 border border-white/5 rounded-3xl cursor-pointer hover:bg-black/40 transition-all"
                  whileHover={{ y: -2 }}
                  onClick={() => setIsCapacityModalOpen(true)}
                >
                  <Users className="w-4 h-4 text-[#B175FF] mb-3" />
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">capacity</span>
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">{mockEventData.capacity}</span>
                </motion.div>

                {/* Approval Required */}
                <motion.div
                  className="flex flex-col p-6 bg-black/20 border border-white/5 rounded-3xl cursor-pointer hover:bg-black/40 transition-all"
                  whileHover={{ y: -2 }}
                  onClick={() => setMockEventData(prev => ({
                    ...prev,
                    requireApproval: !prev.requireApproval
                  }))}
                >
                  <div className="flex justify-between items-start mb-3">
                    <UserCheck className="w-4 h-4 text-[#B175FF]" />
                    <div 
                      className={`w-8 h-4 rounded-full transition-colors ${
                        mockEventData.requireApproval ? 'bg-[#B175FF]' : 'bg-zinc-800'
                      }`}
                    >
                      <motion.div
                        className="w-3 h-3 bg-white rounded-full m-0.5"
                        animate={{ x: mockEventData.requireApproval ? 16 : 0 }}
                      />
                    </div>
                  </div>
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mb-1">approval</span>
                  <span className="text-[10px] text-white font-bold uppercase tracking-widest">{mockEventData.requireApproval ? 'Required' : 'None'}</span>
                </motion.div>
              </div>
            </div>

            {/* Create Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-black py-6 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all"
              onClick={handleCreateEvent}
            >
              Launch Event.
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernEditor;
