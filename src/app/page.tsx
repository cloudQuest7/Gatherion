'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Layout & Common Components
import Navbar from '@/components/layout/Navbar';
import Background from '@/components/layout/Background';
import Footer from '@/components/layout/Footer';
import PopupModal from '@/components/common/PopupModal';
import NotificationToast from '@/components/common/NotificationToast';

// Home Sections
import Hero from '@/components/home/Hero';
import BentoFeatures from '@/components/home/BentoFeatures';
import CreateEventSection from '@/components/home/CreateEvent';
import DiscoverEventsSection from '@/components/home/DiscoverEvents';

// Modals
import CalendarModal from '@/components/modals/CalendarModal';
import RsvpModal from '@/components/modals/RsvpModal';
import CapacityModal from '@/components/modals/CapacityModal';

// Types & Utils
import { Event, Notification, UserProfile, StandardEventData, MockEventData, Theme } from '@/types';
import { fetchRandomUsers } from '@/lib/utils';

export default function GatherApp() {
  // --- State Management ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [interfaceType, setInterfaceType] = useState<'standard' | 'mock'>('mock');
  const [formStep, setFormStep] = useState(1);
  
  // Data State
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [rsvpdEvents, setRsvpdEvents] = useState<string[]>([]);
  const [eventAttendees, setEventAttendees] = useState<{[key: string]: UserProfile[]}>({});
  
  // Modal State
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);
  const [locationInput, setLocationInput] = useState('');

  // Form Data State
  const [eventData, setEventData] = useState<StandardEventData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    coverImage: null,
    eventType: 'public'
  });

  const [mockEventData, setMockEventData] = useState<MockEventData>({
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

  const themes: Theme[] = [
    { name: 'minimal', color: 'bg-white', bgColor: 'bg-gray-800/50' },
    { name: 'cosmic', color: 'bg-gradient-to-r from-purple-500 to-indigo-500', bgColor: 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50' },
    { name: 'forest', color: 'bg-gradient-to-r from-green-500 to-emerald-500', bgColor: 'bg-gradient-to-br from-green-900/50 to-emerald-900/50' },
    { name: 'ocean', color: 'bg-gradient-to-r from-blue-500 to-cyan-500', bgColor: 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50' },
    { name: 'sunset', color: 'bg-gradient-to-r from-orange-500 to-pink-500', bgColor: 'bg-gradient-to-br from-orange-900/50 to-pink-900/50' },
    { name: 'neon', color: 'bg-gradient-to-r from-pink-500 to-yellow-500', bgColor: 'bg-gradient-to-br from-pink-900/50 to-yellow-900/50' }
  ];

  // --- Effects ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const initializeEvents = async () => {
      const dummyEvents: Event[] = [
        {
          id: '1',
          title: 'Tech Meetup 2025',
          description: 'Join us for an evening of innovation and networking. We\'ll be discussing the latest trends in AI and Web Development.',
          date: '2025-05-15',
          time: '18:30',
          location: 'Innovation Hub, Downtown Tech District',
          capacity: '100',
          coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.1&auto=format&fit=crop&w=2000&q=80',
          eventType: 'public',
          attendees: 45,
          createdAt: new Date()
        },
        {
          id: '2',
          title: 'Summer Music Festival',
          description: 'Experience an unforgettable day of live music, food, and fun. Featuring local bands and artists across multiple genres.',
          date: '2025-07-20',
          time: '14:00',
          location: 'Riverside Park Amphitheater',
          capacity: '500',
          coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.1&auto=format&fit=crop&w=2000&q=80',
          eventType: 'public',
          attendees: 213,
          createdAt: new Date()
        },
        {
          id: '3',
          title: 'Cosmic Night: Stargazing Party',
          description: 'Join amateur astronomers for a night under the stars. Professional telescopes provided. Learn about constellations.',
          date: '2025-06-10',
          time: '21:00',
          location: 'Highland Observatory',
          capacity: '50',
          coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.1&auto=format&fit=crop&w=2000&q=80',
          eventType: 'private',
          attendees: 28,
          createdAt: new Date()
        }
      ];
      
      const attendeesMap: {[key: string]: UserProfile[]} = {};
      for (const event of dummyEvents) {
        const attendees = await fetchRandomUsers(5); // Load first 5 for preview
        attendeesMap[event.id] = attendees;
      }
      
      setEvents(dummyEvents);
      setEventAttendees(attendeesMap);
    };

    initializeEvents();
  }, []);

  // --- Handlers ---
  const handleRSVP = async (event: Event) => {
    if (!rsvpdEvents.includes(event.id)) {
      setSelectedEvent(event);
      setShowRsvpModal(true);
    }
  };

  const handleConfirmRSVP = async (eventId: string) => {
    const [newAttendee] = await fetchRandomUsers(1);
    
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, attendees: event.attendees + 1 }
        : event
    ));

    setEventAttendees(prev => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), newAttendee]
    }));

    setRsvpdEvents(prev => [...prev, eventId]);

    const notification = {
      id: Math.random().toString(36).slice(2, 11),
      eventId,
      message: "You're going! 🎉"
    };
    setNotifications(prev => [...prev, notification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData(prev => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: Math.random().toString(36).slice(2, 11),
      ...eventData,
      attendees: 0,
      createdAt: new Date(),
    };
    
    setEvents(prev => [newEvent, ...prev]);
    setFormStep(1);
    setEventData({
      title: '', description: '', date: '', time: '',
      location: '', capacity: '', coverImage: null, eventType: 'public'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#B175FF]/30 overflow-x-hidden">
      <Background />
      <Navbar 
        isScrolled={isScrolled} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        setIsCalendarModalOpen={setIsCalendarModalOpen}
      />

      <main>
        <Hero />
        
        <BentoFeatures />

        <CreateEventSection 
          interfaceType={interfaceType}
          setInterfaceType={setInterfaceType}
          formStep={formStep}
          setFormStep={setFormStep}
          eventData={eventData}
          setEventData={setEventData}
          mockEventData={mockEventData}
          setMockEventData={setMockEventData}
          themes={themes}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          handleNextStep={() => setFormStep(prev => Math.min(prev + 1, 3))}
          handlePrevStep={() => setFormStep(prev => Math.max(prev - 1, 1))}
          setIsLocationModalOpen={setIsLocationModalOpen}
          setIsDescriptionModalOpen={setIsDescriptionModalOpen}
          setIsCapacityModalOpen={setIsCapacityModalOpen}
          setEvents={setEvents}
          setNotifications={setNotifications}
        />

        <DiscoverEventsSection 
          events={events}
          onRsvp={handleRSVP}
          eventAttendees={eventAttendees}
          rsvpdEvents={rsvpdEvents}
        />
      </main>

      <Footer />

      {/* --- Modals --- */}
      <CalendarModal 
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        setNotifications={setNotifications}
      />

      {selectedEvent && (
        <RsvpModal 
          isOpen={showRsvpModal}
          event={selectedEvent} 
          onClose={() => {
            setShowRsvpModal(false);
            setTimeout(() => setSelectedEvent(null), 300);
          }}
          onConfirm={() => handleConfirmRSVP(selectedEvent.id)}
        />
      )}

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
            className="w-full px-4 py-3 bg-gray-700/30 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            placeholder="Describe your event..."
            rows={6}
          />
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDescriptionModalOpen(false)}
            className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold shadow-lg shadow-white/10"
          >
            Save Description
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
            className="w-full px-4 py-3 bg-gray-700/30 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            placeholder="Enter location or meeting link"
          />
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setMockEventData(prev => ({ ...prev, location: locationInput }));
              setIsLocationModalOpen(false);
            }}
            className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold shadow-lg shadow-white/10"
          >
            Save Location
          </motion.button>
        </div>
      </PopupModal>

      <NotificationToast notifications={notifications} />
    </div>
  );
}
