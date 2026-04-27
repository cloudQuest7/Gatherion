// 'use client';
// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Calendar, Plus, User, ChevronDown, Menu, X, CalendarDays, Clock, MapPin, Users, Image, ArrowRight, Check, Link, Save, FileText, Mail, Twitter, Github, Linkedin, Instagram, Layout, Globe, Ticket, UserCheck } from 'lucide-react';

// // Add these animation variants at the top of your file
// const fadeInUp = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.5 }
// };

// const floatingAnimation = {
//   animate: {
//     y: [-10, 10],
//     transition: {
//       duration: 2,
//       repeat: Infinity,
//       repeatType: "reverse",
//       ease: "easeInOut"
//     }
//   }
// };

// // Add this before the GatherApp function
// const PopupModal = ({ 
//   isOpen, 
//   onClose, 
//   title, 
//   children 
// }: { 
//   isOpen: boolean; 
//   onClose: () => void; 
//   title: string; 
//   children: React.ReactNode;
// }) => {
//   if (!isOpen) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center px-4"
//     >
//       <div 
//         className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
//         onClick={onClose}
//       />
      
//       <motion.div
//         initial={{ scale: 0.95 }}
//         animate={{ scale: 1 }}
//         exit={{ scale: 0.95 }}
//         className="bg-gray-800 rounded-xl shadow-xl w-full max-w-lg relative z-50 overflow-hidden"
//       >
//         {/* Modal Header */}
//         <div className="p-4 border-b border-gray-700 flex justify-between items-center">
//           <h3 className="text-lg font-medium text-white">{title}</h3>
//           <button
//             onClick={onClose}
//             className="p-1 rounded-lg hover:bg-gray-700/50 transition-colors"
//             title="Close"
//             aria-label="Close"
//           >
//             <X className="w-5 h-5 text-gray-400" />
//           </button>
//         </div>

//         {/* Modal Content */}
//         <div className="p-4">
//           {children}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// // Your existing GatherApp component below...
// export default function GatherApp() {
//   // Create star field effect
//   const stars = [];
//   for (let i = 0; i < 150; i++) {
//     const size = Math.random() * 2 + 1;
//     stars.push({
//       id: i,
//       size: size,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       opacity: Math.random() * 0.7 + 0.3,
//       duration: Math.random() * 5 + 3,
//       delay: Math.random() * 5
//     });
//   }
//   const [isOpen, setIsOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [activeSection, setActiveSection] = useState('hero');
//   const [formStep, setFormStep] = useState(1);
//   const [eventData, setEventData] = useState({
//     title: '',
//     description: '',
//     date: '',
//     time: '',
//     location: '',
//     capacity: '',
//     coverImage: null,
//     eventType: 'public'
//   });

//   const [events, setEvents] = useState<Event[]>([]);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [rsvpdEvents, setRsvpdEvents] = useState<string[]>([]);
//   const [eventAttendees, setEventAttendees] = useState<{[key: string]: UserProfile[]}>({});
//   const [showRsvpModal, setShowRsvpModal] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);


//   // Add these state variables
//   const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
//   const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
//   const [eventDescription, setEventDescription] = useState('');

//   // Add these state variables for mock event
//   const [mockEventData, setMockEventData] = useState({
//     title: '',
//     date: '2025-05-03',
//     startTime: '18:00',
//     endTime: '19:00',
//     location: '',
//     description: '',
//     isPublic: true,
//     theme: 'minimal',
//     coverImage: null,
//     capacity: 'Unlimited',
//     requireApproval: false,
//     ticketType: 'Free'
//   });

//   // Add location modal state
//   const [locationInput, setLocationInput] = useState('');

//   // Add capacity modal state
//   const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);

//   // Add this state for calendar modal
//   const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
//   const [calendarData, setCalendarData] = useState({
//     name: '',
//     description: '',
//     tintColor: '#00C853' // default green color
//   });

//   // Add the themes array near your other constants
//   const themes = [
//     { name: 'minimal', color: 'bg-white', bgColor: 'bg-gray-800/50' },
//     { name: 'cosmic', color: 'bg-gradient-to-r from-purple-500 to-indigo-500', bgColor: 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50' },
//     { name: 'forest', color: 'bg-gradient-to-r from-green-500 to-emerald-500', bgColor: 'bg-gradient-to-br from-green-900/50 to-emerald-900/50' },
//     { name: 'ocean', color: 'bg-gradient-to-r from-blue-500 to-cyan-500', bgColor: 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50' },
//     { name: 'sunset', color: 'bg-gradient-to-r from-orange-500 to-pink-500', bgColor: 'bg-gradient-to-br from-orange-900/50 to-pink-900/50' },
//     { name: 'neon', color: 'bg-gradient-to-r from-pink-500 to-yellow-500', bgColor: 'bg-gradient-to-br from-pink-900/50 to-yellow-900/50' }
//   ];

//   // Add this with your other state variables
//   const [interfaceType, setInterfaceType] = useState<'standard' | 'mock'>('mock');

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     const initializeEvents = async () => {
//       const dummyEvents: Event[] = [
//         {
//           id: '1',
//           title: 'Tech Meetup 2025',
//           description: 'Join us for an evening of innovation and networking. We\'ll be discussing the latest trends in AI and Web Development, with special guest speakers from leading tech companies.',
//           date: '2025-05-15',
//           time: '18:30',
//           location: 'Innovation Hub, Downtown Tech District',
//           capacity: '100',
//           coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.1&auto=format&fit=crop&w=2000&q=80',
//           eventType: 'public',
//           attendees: 45,
//           createdAt: new Date()
//         },
//         {
//           id: '2',
//           title: 'Summer Music Festival',
//           description: 'Experience an unforgettable day of live music, food, and fun. Featuring local bands and artists across multiple genres. Food trucks and refreshments available.',
//           date: '2025-07-20',
//           time: '14:00',
//           location: 'Riverside Park Amphitheater',
//           capacity: '500',
//           coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.1&auto=format&fit=crop&w=2000&q=80',
//           eventType: 'public',
//           attendees: 213,
//           createdAt: new Date()
//         },
//         {
//           id: '3',
//           title: 'Cosmic Night: Stargazing Party',
//           description: 'Join amateur astronomers for a night under the stars. Professional telescopes provided. Learn about constellations and celestial objects. Hot chocolate and snacks included.',
//           date: '2025-06-10',
//           time: '21:00',
//           location: 'Highland Observatory',
//           capacity: '50',
//           coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.1&auto=format&fit=crop&w=2000&q=80',
//           eventType: 'private',
//           attendees: 28,
//           createdAt: new Date()
//         }
//       ];
      
//       const attendeesMap: {[key: string]: UserProfile[]} = {};
//       for (const event of dummyEvents) {
//         const attendeeCount = event.attendees;
//         const attendees = await fetchRandomUsers(attendeeCount);
//         attendeesMap[event.id] = attendees;
//       }
      
//       setEvents(dummyEvents);
//       setEventAttendees(attendeesMap);
//     };

//     initializeEvents();
//   }, []);

//   const navItems = [
//     { id: 'create', label: 'Create Event', icon: <Plus className="w-4 h-4 mr-2" /> },
//     { id: 'discover', label: 'Discover Events', icon: <Calendar className="w-4 h-4 mr-2" /> },
//   ];

 

//   interface Event {
//     id: string;
//     title: string;
//     description: string;
//     date: string;
//     time: string;
//     location: string;
//     capacity: string;
//     coverImage: string | null;
//     eventType: string;
//     attendees: number;
//     createdAt: Date;
//     requireApproval?: boolean;
//     ticketType?: string;
//     theme?: string;
//   }

//   interface Notification {
//     id: string;
//     eventId: string;
//     message: string;
//   }

//   interface UserProfile {
//     name: string;
//     avatar: string;
//     email: string;
//   }

//   const scrollToSection = (id: string): void => {
//     setActiveSection(id);
//     const element = document.getElementById(id);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//     }
//     setIsOpen(false);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setEventData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setEventData(prev => ({
//           ...prev,
//           coverImage: reader.result as string
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleNextStep = () => {
//     setFormStep(prev => Math.min(prev + 1, 3));
//   };

//   const handlePrevStep = () => {
//     setFormStep(prev => Math.max(prev - 1, 1));
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const newEvent: Event = {
//       id: Math.random().toString(36).substr(2, 9),
//       ...eventData,
//       attendees: 0,
//       createdAt: new Date(),
//     };
    
//     setEvents(prev => [newEvent, ...prev]);
    
//     // Reset form
//     setFormStep(1);
//     setEventData({
//       title: '',
//       description: '',
//       date: '',
//       time: '',
//       location: '',
//       capacity: '',
//       coverImage: null,
//       eventType: 'public'
//     });
//   };

//   const handleRSVP = async (eventId: string) => {
//     if (!rsvpdEvents.includes(eventId)) {
//       // Get a new random user profile for the current user
//       const [newAttendee] = await fetchRandomUsers(1);
      
//       // Update events with new attendee count
//       setEvents(events.map(event => 
//         event.id === eventId 
//           ? { ...event, attendees: event.attendees + 1 }
//           : event
//       ));

//       // Add new attendee to the event's attendee list
//       setEventAttendees(prev => ({
//         ...prev,
//         [eventId]: [...(prev[eventId] || []), newAttendee]
//       }));

//       // Add event to RSVP'd list
//       setRsvpdEvents([...rsvpdEvents, eventId]);

//       // Show notification
//       const newNotification = {
//         id: Math.random().toString(36).substr(2, 9),
//         eventId,
//         message: "You're going to this event! 🎉"
//       };
//       setNotifications([...notifications, newNotification]);

//       setTimeout(() => {
//         setNotifications(prev => 
//           prev.filter(notification => notification.id !== newNotification.id)
//         );
//       }, 3000);
//     }
//   };

//   const fetchRandomUsers = async (count: number): Promise<UserProfile[]> => {
//     const response = await fetch(`https://randomuser.me/api/?results=${count}&inc=name,picture,email`);
//     const data = await response.json();
//     return data.results.map((user: any) => ({
//       name: `${user.name.first} ${user.name.last}`,
//       avatar: user.picture.medium,
//       email: user.email
//     }));
//   };

//   const navbarClasses = `fixed top-0 left-0 w-full transition-all duration-300 z-50 ${
//     isScrolled ? 'bg-gray-900/95 shadow-lg backdrop-blur-sm' : 'bg-transparent'
//   }`;
  
//   // Combine all animations in one style block
//   const globalStyles = `
//     @keyframes float-particle {
//       0%, 100% { transform: translateY(0) translateX(0); }
//       50% { transform: translateY(-10px) translateX(5px); }
//     }
//     @keyframes pulse-glow {
//       0%, 100% { opacity: 0.5; filter: blur(3px); }
//       50% { opacity: 1; filter: blur(5px); }
//     }
//     @keyframes nav-shimmer {
//        0% { background-position: -100% 0; }
//        50% { background-position: 200% 0; }
//     }
//     @keyframes rotate-slow {
//       from { transform: rotate(0deg); }
//       to { transform: rotate(360deg); }
//     }
//     @keyframes float {
//       0%, 100% { transform: translateY(0) translateX(0); }
//       50% { transform: translateY(-20px) translateX(10px); }
//     }
//     @keyframes twinkle {
//       0%, 100% { opacity: 0.4; }
//       50% { opacity: 1; }
//     }
//     @keyframes shooting {
//       0% { transform: translateX(0) translateY(0) rotate(45deg) scale(0); opacity: 0; }
//       5% { opacity: 1; }
//       20% { transform: translateX(-200px) translateY(200px) rotate(45deg) scale(1); opacity: 0; }
//       100% { transform: translateX(-200px) translateY(200px) rotate(45deg) scale(1); opacity: 0; }
//     }
//   `;

//   const CalendarModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
//     // Use local state for form values to prevent rerendering of parent
//     const [localCalendarData, setLocalCalendarData] = useState({
//       name: '',
//       description: '',
//       tintColor: '#00C853'
//     });

//     const tintColors = [
//       '#E0E0E0', '#FF80AB', '#EA80FC', '#8C9EFF', 
//       '#82B1FF', '#00C853', '#FFD740', '#FFAB40', '#FF5252'
//     ];

//     const handleCreateCalendar = (e: React.FormEvent) => {
//       e.preventDefault();
      
//       // Update parent state only when creating
//       const newCalendar = {
//         id: Math.random().toString(36).substr(2, 9),
//         ...localCalendarData,
//         createdAt: new Date()
//       };
      
//       // Show success notification
//       const notification = {
//         id: Math.random().toString(36).substr(2, 9),
//         eventId: newCalendar.id,
//         message: "Calendar created successfully! 🗓️"
//       };
//       setNotifications(prev => [...prev, notification]);

//       // Clear form and close modal
//       setLocalCalendarData({
//         name: '',
//         description: '',
//         tintColor: '#00C853'
//       });
//       onClose();

//       // Remove notification after 2.5 seconds
//       setTimeout(() => {
//         setNotifications(prev => 
//           prev.filter(n => n.id !== notification.id)
//         );
//       }, 2500); // Changed from 3000 to 2500 milliseconds
//     };

//     return (
//       <PopupModal
//         isOpen={isOpen}
//         onClose={onClose}
//         title="Create Calendar"
//       >
//         <form onSubmit={handleCreateCalendar} className="space-y-6">
//           {/* Calendar Name */}
//           <div>
//             <input
//               type="text"
//               value={localCalendarData.name}
//               onChange={(e) => setLocalCalendarData(prev => ({ 
//                 ...prev, 
//                 name: e.target.value 
//               }))}
//               className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Calendar Name"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <textarea
//               value={localCalendarData.description}
//               onChange={(e) => setLocalCalendarData(prev => ({ 
//                 ...prev, 
//                 description: e.target.value 
//               }))}
//               className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Add a short description"
//               rows={3}
//             />
//           </div>

//           {/* Tint Color Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-300 mb-2">
//               Tint Color
//             </label>
//             <div className="flex flex-wrap gap-2">
//               {tintColors.map((color) => (
//                 <button
//                   type="button" // Prevent form submission on click
//                   key={color}
//                   onClick={() => setLocalCalendarData(prev => ({ 
//                     ...prev, 
//                     tintColor: color 
//                   }))}
//                   className={`w-8 h-8 rounded-full transition-all ${
//                     localCalendarData.tintColor === color 
//                       ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' 
//                       : 'hover:scale-110'
//                   }`}
//                   style={{ backgroundColor: color }}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Create Button */}
//           <motion.button
//             type="submit"
//             whileHover={{ scale: 1.01 }}
//             whileTap={{ scale: 0.99 }}
//             className="w-full bg-white text-gray-900 py-3 rounded-lg font-medium"
//             disabled={!localCalendarData.name}
//           >
//             Create Calendar
//           </motion.button>
//         </form>
//       </PopupModal>
//     );
//   };

//   const RsvpModal = ({ event, onClose }: { event: Event; onClose: () => void }) => {
//     const [localRsvpStatus, setLocalRsvpStatus] = useState<'going' | 'maybe' | 'not-going' | null>(null);
//     const [localGuestCount, setLocalGuestCount] = useState(1);
//     const [localDietaryRestrictions, setLocalDietaryRestrictions] = useState('');
//     const [localAdditionalNotes, setLocalAdditionalNotes] = useState('');

//     const handleSubmit = () => {
//       handleRSVP(event.id);
//       onClose();
//     };

//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 z-50 flex items-center justify-center px-4"
//       >
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        
//         <motion.div
//           initial={{ scale: 0.95, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.95, opacity: 0 }}
//           className="bg-gray-800 rounded-xl shadow-xl w-full max-w-lg relative z-50 overflow-hidden"
//         >
//           {/* Event Header */}
//           <div className="relative h-32 overflow-hidden">
//             <img 
//               src={event.coverImage || '/default-event-cover.jpg'} 
//               alt={event.title}
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent" />
//             <button 
//               onClick={onClose}
//               className="absolute top-4 right-4 p-1 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
//             >
//               <X className="w-5 h-5 text-white" />
//             </button>
//           </div>

//           <div className="p-6">
//             <h3 className="text-xl font-semibold text-white mb-4">{event.title}</h3>
            
//             {/* RSVP Status Selection */}
//             <div className="space-y-4 mb-6">
//               <label className="block text-sm font-medium text-gray-300">
//                 Will you attend?
//               </label>
//               <div className="grid grid-cols-3 gap-3">
//                 {['going', 'maybe', 'not-going'].map((status) => (
//                   <button
//                     key={status}
//                     onClick={() => setLocalRsvpStatus(status as any)}
//                     className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
//                       ${localRsvpStatus === status 
//                         ? 'bg-purple-600 text-white' 
//                         : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'}`}
//                   >
//                     {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Additional Options - Show only if 'going' or 'maybe' */}
//             {(localRsvpStatus === 'going' || localRsvpStatus === 'maybe') && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="space-y-4"
//               >
//                 {/* Guest Count */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Number of Guests
//                   </label>
//                   <div className="flex items-center space-x-3">
//                     <button
//                       onClick={() => setLocalGuestCount(Math.max(1, localGuestCount - 1))}
//                       className="p-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700"
//                     >
//                       -
//                     </button>
//                     <span className="text-white font-medium">{localGuestCount}</span>
//                     <button
//                       onClick={() => setLocalGuestCount(Math.min(parseInt(event.capacity) || 10, localGuestCount + 1))}
//                       className="p-2 rounded-lg bg-gray-700/50 text-gray-300 hover:bg-gray-700"
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>

//                 {/* Dietary Restrictions */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Dietary Restrictions
//                   </label>
//                   <input
//                     type="text"
//                     value={localDietaryRestrictions}
//                     onChange={(e) => setLocalDietaryRestrictions(e.target.value)}
//                     className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
//                     placeholder="Vegetarian, vegan, allergies, etc."
//                   />
//                 </div>

//                 {/* Additional Notes */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Additional Notes
//                   </label>
//                   <textarea
//                     value={localAdditionalNotes}
//                     onChange={(e) => setLocalAdditionalNotes(e.target.value)}
//                     className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
//                     placeholder="Any questions or special requests?"
//                     rows={3}
//                   />
//                 </div>
//               </motion.div>
//             )}

//             {/* Submit Button */}
//             <button
//               onClick={handleSubmit}
//               disabled={!localRsvpStatus}
//               className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 
//                 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
//                 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
//             >
//               Confirm RSVP
//             </button>
//           </div>
//         </motion.div>
//       </motion.div>
//     );
//   };

//   const CapacityModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
//     const [capacityType, setCapacityType] = useState(mockEventData.capacity === 'Unlimited' ? 'unlimited' : 'limited');
//     const [capacityValue, setCapacityValue] = useState(
//       mockEventData.capacity === 'Unlimited' ? '' : mockEventData.capacity
//     );

//     const handleSave = () => {
//       setMockEventData(prev => ({
//         ...prev,
//         capacity: capacityType === 'unlimited' ? 'Unlimited' : capacityValue
//       }));
//       onClose();
//     };

//     return (
//       <PopupModal
//         isOpen={isOpen}
//         onClose={onClose}
//         title="Set Event Capacity"
//       >
//         <div className="space-y-6">
//           {/* Capacity Type Selection */}
//           <div className="space-y-4">
//             <div 
//               onClick={() => setCapacityType('unlimited')}
//               className={`p-4 rounded-lg cursor-pointer transition-all ${
//                 capacityType === 'unlimited' 
//                   ? 'bg-green-900/20 border border-green-500/50' 
//                   : 'bg-gray-700/30 hover:bg-gray-700/50'
//               }`}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-2">
//                   <Users className="w-4 h-4 text-green-400" />
//                   <span className="text-gray-300">Unlimited capacity</span>
//                 </div>
//                 {capacityType === 'unlimited' && (
//                   <Check className="w-4 h-4 text-green-400" />
//                 )}
//               </div>
//             </div>

//             <div 
//               onClick={() => setCapacityType('limited')}
//               className={`p-4 rounded-lg cursor-pointer transition-all ${
//                 capacityType === 'limited' 
//                   ? 'bg-green-900/20 border border-green-500/50' 
//                   : 'bg-gray-700/30 hover:bg-gray-700/50'
//               }`}
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center space-x-2">
//                   <Users className="w-4 h-4 text-green-400" />
//                   <span className="text-gray-300">Limited capacity</span>
//                 </div>
//                 {capacityType === 'limited' && (
//                   <Check className="w-4 h-4 text-green-400" />
//                 )}
//               </div>
              
//               {capacityType === 'limited' && (
//                 <div className="mt-3">
//                   <input
//                     type="number"
//                     min="1"
//                     value={capacityValue}
//                     onChange={(e) => setCapacityValue(e.target.value)}
//                     className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                     placeholder="Enter maximum capacity"
//                     autoFocus
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Save Button */}
//           <motion.button
//             whileHover={{ scale: 1.01 }}
//             whileTap={{ scale: 0.99 }}
//             onClick={handleSave}
//             className="w-full bg-white text-gray-900 py-2 rounded-lg font-medium"
//             disabled={capacityType === 'limited' && !capacityValue}
//           >
//             Save
//           </motion.button>
//         </div>
//       </PopupModal>
//     );
//   };

//   const InterfaceSwitch = () => {
//     return (
//       <div className="flex justify-center mb-8">
//         <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full p-1">
//           <button
//             onClick={() => setInterfaceType('mock')}
//             className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//               interfaceType === 'mock' 
//                 ? 'bg-purple-600 text-white' 
//                 : 'text-gray-400 hover:text-white'
//             }`}
//           >
//             Modern Editor
//           </button>
//           <button
//             onClick={() => setInterfaceType('standard')}
//             className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//               interfaceType === 'standard' 
//                 ? 'bg-purple-600 text-white' 
//                 : 'text-gray-400 hover:text-white'
//             }`}
//           >
//             Standard Editor
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="bg-gray-900 text-gray-300 min-h-screen relative">
//       {/* Single global styles tag */}
//       <style jsx global>{globalStyles}</style>
      
//       {/* Galactic Background with Black Hole Effect */}
//       <div className="fixed inset-0 bg-black z-0 overflow-hidden">
//         {/* Radial stars and cosmic dust */}
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(38,38,76,0.3)_0%,rgba(13,12,34,0.8)_70%,rgba(5,5,15,1)_100%)]"></div>
        
//         {/* Star field */}
//         {stars.map(star => (
//           <div 
//             key={`fixed-star-${star.id}`}
//             className="absolute rounded-full bg-white"
//             style={{
//               width: `${star.size}px`,
//               height: `${star.size}px`,
//               top: `${star.y}%`,
//               left: `${star.x}%`,
//               opacity: star.opacity,
//               animation: `twinkle ${star.duration}s infinite ease-in-out`,
//               animationDelay: `${star.delay}s`
//             }}
//           />
//         ))}
        
//         {/* Distant nebulas */}
//         <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-900/10 via-transparent to-indigo-900/10 blur-3xl"></div>
//         <div className="absolute top-3/4 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-900/10 via-transparent to-blue-900/10 blur-3xl"></div>
//         <div className="absolute top-10 right-1/4 w-1/4 h-1/4 bg-gradient-to-bl from-indigo-900/5 via-transparent to-purple-900/5 blur-3xl"></div>
//       </div>
//       {/* Navbar */}
//       <nav className={navbarClasses}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* Logo */}
//             <div className="flex-shrink-0 flex items-center">
//               <div className="flex items-center space-x-2 group relative cursor-pointer">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-800 group-hover:from-purple-500 group-hover:to-indigo-700 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
//                   <Calendar className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
//                 </div>
//                 <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-600 text-transparent bg-clip-text group-hover:from-purple-300 group-hover:to-indigo-500 transition-all duration-300">Gatherion</span>
                
//                 {/* Logo hover effect particles */}
//                 <div className="absolute -inset-2 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   {[...Array(6)].map((_, i) => (
//                     <div
//                       key={`logo-particle-${i}`}
//                       className="absolute rounded-full bg-purple-500/20"
//                       style={{
//                         width: `${Math.random() * 5 + 3}px`,
//                         height: `${Math.random() * 5 + 3}px`,
//                         top: `${Math.random() * 100}%`,
//                         left: `${Math.random() * 100}%`,
//                         animation: `float-particle 2s infinite ease-in-out`,
//                         animationDelay: `${Math.random() * 0.5}s`,
//                         animationDuration: `${Math.random() * 2 + 1}s`,
//                       }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
            
//             {/* Desktop navigation */}
//             <div className="hidden md:flex space-x-4">
//               {navItems.map((item) => (
//                 <button
//                   title="Click to toggle menu"
//                   key={item.id}
//                   onClick={() => scrollToSection(item.id)}
//                   className={`flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors relative overflow-hidden group ${
//                     activeSection === item.id ? 'text-purple-400 bg-gray-800/50' : 'text-gray-300'
//                   }`}
//                 >
//                   {/* Nav item hover effect - glow */}
//                   <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/20 to-purple-600/0 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></span>
                  
//                   {/* Nav item hover effect - border */}
//                   <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
                  
//                   {/* Icon with hover effect */}
//                   <span className="relative mr-2 text-purple-400 group-hover:scale-110 transition-transform duration-300">
//                     {item.icon}
//                   </span>
                  
//                   {/* Text with hover effect */}
//                   <span className="relative">{item.label}</span>
//                 </button>
//               ))}
//               <button
//                 onClick={() => setIsCalendarModalOpen(true)}
//                 className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
//               >
//                 <Calendar className="w-4 h-4 mr-2 text-purple-400" />
//                 <span>Create Calendar</span>
//               </button>
//             </div>
            
//             {/* Profile button (desktop) */}
//             <div className="hidden md:flex items-center">
//               <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors group relative overflow-hidden">
//                 {/* Profile hover glow effect */}
//                 <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></span>
                
//                 {/* Profile animation ring */}
//                 <span className="absolute inset-0 border border-purple-500/0 group-hover:border-purple-500/30 rounded-md group-hover:scale-105 transition-all duration-300"></span>
                
//                 <span className="relative flex items-center">
//                   <User className="w-4 h-4 mr-2 group-hover:text-purple-400 transition-colors duration-300" />
//                   <span className="group-hover:text-purple-300 transition-colors duration-300">Profile</span>
//                   <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
//                 </span>
//               </button>
//             </div>
            
//             {/* Mobile menu button */}
//             <div className="md:hidden">
//               <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="bg-gray-800/50 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none group relative overflow-hidden"
//                 onMouseEnter={() => setHoverEffect(true)}
//                 onMouseLeave={() => setHoverEffect(false)}
//               >
//                 {/* Mobile button hover effect */}
//                 <span className="absolute inset-0 bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                
//                 {isOpen ? (
//                   <X className="block h-6 w-6 relative z-10 group-hover:text-purple-300 transition-colors duration-300 group-hover:rotate-90 transition-transform" />
//                 ) : (
//                   <Menu className="block h-6 w-6 relative z-10 group-hover:text-purple-300 transition-colors duration-300 group-hover:scale-110 transition-transform" />
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         <div 
//           className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-gray-900/95 backdrop-blur-sm shadow-lg border-t border-gray-800/50`}
//         >
//           <div className="px-2 pt-2 pb-3 space-y-1">
//             {navItems.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => scrollToSection(item.id)}
//                 className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-all duration-300 relative overflow-hidden group ${
//                   activeSection === item.id ? 'text-purple-400 bg-gray-800/50' : 'text-gray-300'
//                 }`}
//               >
//                 {/* Mobile nav item hover glow */}
//                 <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></span>
                
//                 <span className="relative flex items-center">
//                   <span className="mr-2 text-purple-400 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
//                   <span className="group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
//                 </span>
//               </button>
//             ))}
//             <button className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 transition-all duration-300 relative overflow-hidden group">
//               {/* Mobile profile hover glow */}
//               <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-purple-600/0 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></span>
              
//               <span className="relative flex items-center">
//                 <User className="w-4 h-4 mr-2 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
//                 <span className="group-hover:translate-x-1 transition-transform duration-300">Profile</span>
//               </span>
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section id="hero" className="pt-28 pb-20 relative overflow-hidden">
//         {/* Enhanced Background Effects */}
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1.5 }}
//           className="absolute inset-0"
//         >
//           <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/10 to-indigo-900/20"></div>
          
//           {/* Animated Grid */}
//           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] motion-safe:animate-[grid_20s_linear_infinite]"></div>
          
//           {/* Enhanced Nebula Effects */}
//           {[...Array(5)].map((_, i) => (
//             <motion.div
//               key={`nebula-${i}`}
//               initial={{ opacity: 0 }}
//               animate={{ 
//                 opacity: [0.1, 0.3, 0.1],
//                 scale: [1, 1.2, 1],
//                 y: [-20, 20, -20],
//                 x: [-10, 10, -10]
//               }}
//               transition={{
//                 duration: 8 + i * 2,
//                 repeat: Infinity,
//                 delay: i * 0.7
//               }}
//               className="absolute rounded-full blur-3xl"
//               style={{
//                 background: `radial-gradient(circle, rgba(124,58,237,${0.2 + i * 0.1}) 0%, transparent 70%)`,
//                 width: `${300 + i * 100}px`,
//                 height: `${300 + i * 100}px`,
//                 top: `${20 + i * 15}%`,
//                 left: `${10 + i * 20}%`,
//               }}
//             />
//           ))}
//         </motion.div>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             {/* Left Content */}
//             <motion.div
//               initial="initial"
//               animate="animate"
//               variants={{
//                 animate: {
//                   transition: {
//                     staggerChildren: 0.1
//                   }
//                 }
//               }}
//               className="space-y-8"
//             >
//               <motion.div variants={fadeInUp} className="space-y-4">
//                 <motion.div 
//                   initial={{ opacity: 0, scale: 0.5 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                   className="inline-block"
//                 >
//                   <motion.span
//                     whileHover={{ scale: 1.05 }}
//                     className="inline-flex items-center px-3 py-1 rounded-full bg-purple-900/30 border border-purple-700/50"
//                   >
//                     <motion.div
//                       animate={{ scale: [1, 1.2, 1] }}
//                       transition={{ duration: 2, repeat: Infinity }}
//                       className="w-2 h-2 rounded-full bg-purple-400 mr-2"
//                     />
//                     <span className="text-purple-300 text-sm">✨ Create Amazing Events</span>
//                   </motion.span>
//                 </motion.div>

//                 <motion.h1 
//                   variants={fadeInUp}
//                   className="text-6xl md:text-7xl font-bold tracking-tight"
//                 >
//                   <motion.span
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.5, delay: 0.2 }}
//                     className="block text-white mb-2"
//                   >
//                     Plan Events
//                   </motion.span>
//                   <motion.span
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 0.5, delay: 0.4 }}
//                     className="block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 text-transparent bg-clip-text"
//                   >
//                     Like Never Before
//                   </motion.span>
//                 </motion.h1>

//                 <motion.p
//                   variants={fadeInUp}
//                   className="mt-6 text-xl text-gray-300 max-w-lg leading-relaxed"
//                 >
//                   Create unforgettable gatherings with Gatherion's intelligent event planning platform. 
//                   From intimate meetups to grand celebrations, we've got you covered.
//                 </motion.p>
//               </motion.div>

//               <motion.div 
//                 variants={fadeInUp}
//                 className="flex flex-wrap gap-4"
//               >
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200"
//                 >
//                   Get Started Free
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="px-8 py-4 rounded-lg bg-gray-800/70 text-white font-medium hover:bg-gray-800 transition-all duration-200 flex items-center group"
//                 >
//                   Watch Demo
//                   <motion.span 
//                     animate={{ x: [0, 5, 0] }}
//                     transition={{ repeat: Infinity, duration: 1.5 }}
//                     className="ml-2"
//                   >
//                     →
//                   </motion.span>
//                 </motion.button>
//               </motion.div>

//               <motion.div
//                 variants={fadeInUp}
//                 className="pt-8 flex items-center space-x-8"
//               >
//                 <motion.div 
//                   variants={floatingAnimation}
//                   animate="animate"
//                   className="flex -space-x-4"
//                 >
//                   {[...Array(4)].map((_, i) => (
//                     <motion.img
//                       key={i}
//                       src={`https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i + 1}.jpg`}
//                       alt="User"
//                       className="w-12 h-12 rounded-full border-2 border-gray-800"
//                       whileHover={{ scale: 1.1, zIndex: 1 }}
//                     />
//                   ))}
//                   <motion.div
//                     whileHover={{ scale: 1.1 }}
//                     className="w-12 h-12 rounded-full bg-purple-600/10 border-2 border-purple-500/50 flex items-center justify-center text-purple-400 text-sm"
//                   >
//                     +2K
//                   </motion.div>
//                 </motion.div>
                
//                 <div className="space-y-1">
//                   <motion.div 
//                     animate={{ scale: [1, 1.1, 1] }}
//                     transition={{ duration: 2, repeat: Infinity }}
//                     className="flex items-center gap-1"
//                   >
//                     {[...Array(5)].map((_, i) => (
//                       <motion.svg
//                         key={i}
//                         initial={{ opacity: 0, scale: 0 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ delay: i * 0.1 }}
//                         className="w-5 h-5 text-yellow-400"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                       </motion.svg>
//                     ))}
//                   </motion.div>
//                   <p className="text-gray-400 text-sm">Trusted by over 2,000 event organizers</p>
//                 </div>
//               </motion.div>
//             </motion.div>

//             {/* Right Content - Interactive Preview */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.5 }}
//               className="relative hidden lg:block"
//             >
//               <motion.div
//                 animate={{
//                   boxShadow: [
//                     "0 0 0 0 rgba(124, 58, 237, 0)",
//                     "0 0 20px 5px rgba(124, 58, 237, 0.3)",
//                     "0 0 0 0 rgba(124, 58, 237, 0)"
//                   ]
//                 }}
//                 transition={{ duration: 2, repeat: Infinity }}
//                 className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden"
//               >
//                 {/* Card Header */}
//                 <div className="px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
//                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <motion.div 
//                       className="w-2 h-2 rounded-full bg-green-500"
//                       animate={{ opacity: [1, 0.5, 1] }}
//                       transition={{ duration: 2, repeat: Infinity }}
//                     />
//                     <span className="text-sm text-gray-400">Live Preview</span>
//                   </div>
//                 </div>

//                 {/* Card Content */}
//                 <div className="p-6">
//                   <div className="space-y-6">
//                     {/* Event Header */}
//                     <div className="flex items-center space-x-4">
//                       <motion.div
//                         className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20 flex items-center justify-center"
//                         animate={{ scale: [1, 1.05, 1] }}
//                         transition={{ duration: 2, repeat: Infinity }}
//                       >
//                         <Calendar className="w-8 h-8 text-purple-400" />
//                       </motion.div>
//                       <div>
//                         <motion.div 
//                           className="h-4 w-32 bg-gray-700/50 rounded mb-2"
//                           animate={{ opacity: [0.5, 0.8, 0.5] }}
//                           transition={{ duration: 2, repeat: Infinity }}
//                         />
//                         <motion.div 
//                           className="h-3 w-24 bg-gray-700/50 rounded"
//                           animate={{ opacity: [0.5, 0.8, 0.5] }}
//                           transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
//                         />
//                       </div>
//                     </div>

//                     {/* RSVP Options */}
//                     <div className="grid grid-cols-3 gap-3">
//                       {['Going', 'Maybe', 'Not Going'].map((status, i) => (
//                         <motion.div
//                           key={status}
//                           whileHover={{ scale: 1.02 }}
//                           className="p-3 rounded-lg bg-gray-700/30 hover:bg-purple-600/20 transition-colors cursor-pointer border border-transparent hover:border-purple-500/50"
//                         >
//                           <motion.div 
//                             className="w-full h-1 bg-purple-500/30 rounded mb-2"
//                             animate={{ width: ['0%', '100%'] }}
//                             transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
//                           />
//                           <div className="text-sm text-center text-gray-400">{status}</div>
//                         </motion.div>
//                       ))}
//                     </div>

//                     {/* Attendee Preview */}
//                     <div className="bg-gray-700/20 rounded-lg p-4">
//                       <div className="flex items-center justify-between mb-3">
//                         <motion.div 
//                           className="h-3 w-20 bg-gray-700/50 rounded"
//                           animate={{ opacity: [0.5, 0.8, 0.5] }}
//                           transition={{ duration: 2, repeat: Infinity }}
//                         />
//                         <motion.span
//                           className="text-xs text-purple-400"
//                           animate={{ opacity: [0.5, 1, 0.5] }}
//                           transition={{ duration: 2, repeat: Infinity }}
//                         >
//                           {Math.floor(Math.random() * 50) + 20} attending
//                         </motion.span>
//                       </div>
                      
//                       <div className="flex items-center">
//                         {[...Array(5)].map((_, i) => (
//                           <motion.div
//                             key={i}
//                             initial={{ opacity: 0, x: -10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: i * 0.1 }}
//                             className="relative -ml-2 first:ml-0"
//                           >
//                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-gray-700" />
//                           </motion.div>
//                         ))}
//                         <motion.div
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: 0.5 }}
//                           className="w-8 h-8 -ml-2 rounded-full bg-gray-700/50 flex items-center justify-center text-xs text-gray-400"
//                         >
//                           +12
//                         </motion.div>
//                       </div>
//                     </div>

//                     {/* Animated Activity Indicators */}
//                     <div className="space-y-2">
//                       {[...Array(3)].map((_, i) => (
//                         <motion.div
//                           key={i}
//                           className="flex items-center space-x-2"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: i * 0.1 }}
//                         >
//                           <div className="w-2 h-2 rounded-full bg-green-500" />
//                           <motion.div 
//                             className="h-2 bg-gray-700/50 rounded"
//                             style={{ width: `${70 - i * 20}%` }}
//                             animate={{ opacity: [0.5, 0.8, 0.5] }}
//                             transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
//                           />
//                         </motion.div>
//                       ))}
//                     </div>

//                     {/* Action Button */}
//                     <motion.div
//                       className="mt-4 h-9 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center"
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                     >
//                       <motion.span
//                         className="text-sm text-purple-400"
//                         animate={{ opacity: [0.7, 1, 0.7] }}
//                         transition={{ duration: 2, repeat: Infinity }}
//                       >
//                         Confirm RSVP
//                       </motion.span>
//                     </motion.div>
//                   </div>
//                 </div>

//                 {/* Card Footer */}
//                 <div className="px-6 py-4 border-t border-gray-700/50">
//                   <motion.div 
//                     className="h-4 bg-gray-700/50 rounded w-1/3"
//                     animate={{ opacity: [0.5, 0.8, 0.5] }}
//                     transition={{ duration: 2, repeat: Infinity }}
//                   />
//                 </div>
//               </motion.div>

//               {/* Background Glow Effect */}
//               <motion.div
//                 className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-20 blur-2xl"
//                 animate={{
//                   opacity: [0.1, 0.3, 0.1],
//                   scale: [0.8, 1, 0.8]
//                 }}
//                 transition={{
//                   duration: 4,
//                   repeat: Infinity
//                 }}
//               />
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Create Event Section */}
//       <section id="create" className="py-16 relative z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Create Your Event</h2>
//             <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//               Choose your preferred event creation interface
//             </p>
//           </div>

//           {/* Interface Switch */}
//           <div className="flex justify-center mb-8">
//             <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full p-1">
//               <button
//                 onClick={() => setInterfaceType('mock')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   interfaceType === 'mock' 
//                     ? 'bg-purple-600 text-white' 
//                     : 'text-gray-400 hover:text-white'
//                 }`}
//               >
//                 Modern Editor
//               </button>
//               <button
//                 onClick={() => setInterfaceType('standard')}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                   interfaceType === 'standard' 
//                     ? 'bg-purple-600 text-white' 
//                     : 'text-gray-400 hover:text-white'
//                 }`}
//               >
//                 Standard Editor
//               </button>
//             </div>
//           </div>

//           {/* Conditional Rendering */}
//           {interfaceType === 'standard' ? (
//             <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto">
//               {/* Progress Bar */}
//               <div className="mb-8">
//                 <div className="flex items-center justify-between mb-2">
//                   {['Event Details', 'Date & Time', 'Additional Info'].map((step, index) => (
//                     <div
//                       key={step}
//                       className="flex items-center"
//                     >
//                       <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                         formStep > index + 1 
//                           ? 'bg-green-500 text-white' 
//                           : formStep === index + 1 
//                             ? 'bg-purple-600 text-white'
//                             : 'bg-gray-700 text-gray-400'
//                       }`}>
//                         {formStep > index + 1 ? <Check className="w-5 h-5" /> : index + 1}
//                       </div>
//                       <span className="ml-2 text-sm font-medium text-gray-400">{step}</span>
//                       {index < 2 && (
//                         <div className="w-24 h-px bg-gray-700 mx-4"></div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-8">
//                 {/* Step 1: Event Details */}
//                 {formStep === 1 && (
//                   <motion.div
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -20 }}
//                     className="space-y-6"
//                   >
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Event Name*
//                       </label>
//                       <input
//                         type="text"
//                         name="title"
//                         value={eventData.title}
//                         onChange={handleChange}
//                         className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                         placeholder="Enter event name"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Event Type
//                       </label>
//                       <div className="grid grid-cols-2 gap-4">
//                         {['public', 'private'].map((type) => (
//                           <button
//                             key={type}
//                             type="button"
//                             onClick={() => setEventData(prev => ({ ...prev, eventType: type }))}
//                             className={`px-4 py-3 rounded-lg text-sm font-medium capitalize transition-all ${
//                               eventData.eventType === type 
//                                 ? 'bg-purple-600 text-white' 
//                                 : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
//                             }`}
//                           >
//                             {type}
//                           </button>
//                         ))}
//                       </div>

//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Description
//                       </label>
//                       <textarea
//                         name="description"
//                         value={eventData.description}
//                         onChange={handleChange}
//                         rows={4}
//                         className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                         placeholder="Describe your event"
//                       />
//                     </div>
//                   </motion.div>
//                 )}

//                 {/* Step 2: Date & Time */}
//                 {formStep === 2 && (
//                   <motion.div
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -20 }}
//                     className="space-y-6"
//                   >
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Date*
//                       </label>
//                       <input
//                         type="date"
//                         name="date"
//                         value={eventData.date}
//                         onChange={handleChange}
//                         className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Time*
//                       </label>
//                       <input
//                         type="time"
//                         name="time"
//                         value={eventData.time}
//                         onChange={handleChange}
//                         className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Duration
//                       </label>
//                       <select
//                         className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                       >
//                         <option value="1">1 hour</option>
//                         <option value="2">2 hours</option>
//                         <option value="3">3 hours</option>
//                         <option value="4">4 hours</option>
//                         <option value="custom">Custom</option>
//                       </select>
//                     </div>
//                   </motion.div>
//                 )}

//                 {/* Step 3: Additional Info */}
//                 {formStep === 3 && (
//                   <motion.div
//                     initial={{ opacity: 0, x: 20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0, x: -20 }}
//                     className="space-y-6"
//                   >
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Location*
//                       </label>
//                       <input
//                         type="text"
//                         name="location"
//                         value={eventData.location}
//                         onChange={handleChange}
//                         className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                         placeholder="Enter location or meeting link"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Capacity
//                       </label>
//                       <input
//                         type="number"
//                         name="capacity"
//                         value={eventData.capacity}
//                         onChange={handleChange}
//                         min="1"
//                         className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                         placeholder="Maximum number of attendees"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">
//                         Cover Image
//                       </label>
//                       <div
//                         onClick={() => document.getElementById('coverImage')?.click()}
//                         className="w-full h-32 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 transition-colors"
//                       >
//                         <Image className="w-8 h-8 text-gray-400 mb-2" />
//                         <span className="text-sm text-gray-400">Click to upload image</span>
//                       </div>
//                       <input
//                         id="coverImage"
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={handleFileChange}
//                       />
//                     </div>
//                   </motion.div>
//                 )}

//                 {/* Navigation Buttons */}
//                 <div className="flex justify-between">
//                   {formStep > 1 && (
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       type="button"
//                       onClick={handlePrevStep}
//                       className="px-6 py-2 bg-gray-700/50 text-white rounded-lg hover:bg-gray-700 transition-colors"
//                     >
//                       Previous
//                     </motion.button>
//                   )}
                  
//                   {formStep < 3 ? (
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       type="button"
//                       onClick={handleNextStep}
//                       className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ml-auto"
//                     >
//                       Next
//                     </motion.button>
//                   ) : (
//                     <motion.button
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       type="submit"
//                       className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors ml-auto"
//                     >
//                       Create Event
//                     </motion.button>
//                   )}
//                 </div>
//               </form>
//             </div>
//           ) : (
//             <div className="max-w-6xl mx-auto">
//               {/* Your existing mock event content */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Left Column - Image & Theme */}
//                 <div className="space-y-6">
//                   {/* Image Upload Area */}
//                   <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
//                     <div
//                       onClick={() => document.getElementById('mockCoverImageInput')?.click()}
//                       className="aspect-square rounded-xl bg-gray-900/50 border-2 border-dashed border-gray-700 flex flex-col items-center justify-center hover:border-green-500/50 transition-colors cursor-pointer group relative overflow-hidden"
//                     >
//                       {mockEventData?.coverImage ? (
//                         <>
//                           <img 
//                             src={mockEventData.coverImage}
//                             alt="Event cover"
//                             className="absolute inset-0 w-full h-full object-cover"
//                           />
//                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                             <p className="text-white text-sm">Click to change image</p>
//                           </div>
//                         </>
//                       ) : (
//                         <>
//                           <motion.div
//                             whileHover={{ scale: 1.05 }}
//                             className="w-16 h-16 rounded-full bg-gray-800/80 flex items-center justify-center mb-4"
//                           >
//                             <Image className="w-8 h-8 text-green-400" />
//                           </motion.div>
//                           <p className="text-sm text-gray-400 text-center">
//                             <span className="text-green-400 group-hover:underline">Upload</span> or drag and drop
//                             <br />an image (max 10MB)
//                           </p>
//                         </>
//                       )}
//                     </div>
//                     <input
//                       id="mockCoverImageInput"
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={(e) => {
//                         const file = e.target.files?.[0];
//                         if (file) {
//                           const reader = new FileReader();
//                           reader.onloadend = () => {
//                             setMockEventData(prev => ({
//                               ...prev,
//                               coverImage: reader.result as string
//                             }));
//                           };
//                           reader.readAsDataURL(file);
//                         }
//                       }}
//                     />
//                   </div>

//                   {/* Theme Selector */}
//                   <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
//                     <h3 className="text-sm font-medium text-white mb-4">Theme</h3>
//                     <div className="grid grid-cols-2 gap-3">
//                       {themes.map((theme) => (
//                         <motion.button
//                           key={theme.name}
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                           onClick={() => setMockEventData(prev => ({ ...prev, theme: theme.name }))}
//                           className={`p-4 rounded-xl border transition-all duration-200 ${
//                             mockEventData?.theme === theme.name
//                               ? 'border-green-500 bg-gray-800/80'
//                               : 'border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/50'
//                           }`}
//                         >
//                           <div className={`w-full h-8 rounded-lg ${theme.color} mb-2`} />
//                           <span className="text-xs text-gray-400 capitalize">
//                             {theme.name}
//                           </span>
//                         </motion.button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Column - Event Details */}
//                 <div className={`lg:col-span-2 backdrop-blur-sm rounded-2xl border border-gray-700/50 transition-all duration-300 ${
//                   themes.find(t => t.name === mockEventData.theme)?.bgColor || 'bg-gray-800/50'
//                 }`}>
//                   {/* Rest of your existing mock event content */}
//                   <div className="px-6 py-6 space-y-6">
//                     {/* Event Name */}
//                     <input
//                       type="text"
//                       placeholder="Event Name"
//                       value={mockEventData.title}
//                       onChange={(e) => setMockEventData(prev => ({ 
//                         ...prev, 
//                         title: e.target.value 
//                       }))}
//                       className="w-full text-4xl font-light text-white bg-transparent placeholder-gray-500 focus:outline-none"
//                     />

//                     {/* Date Time Section */}
//                     <div className="space-y-3">
//                       {/* Start Time */}
//                       <div className="flex items-center space-x-3">
//                         <div className="w-2 h-2 rounded-full bg-green-500"></div>
//                         <div className="flex items-center space-x-2 flex-1">
//                           <input
//                             type="date"
//                             value={mockEventData.date}
//                             onChange={(e) => setMockEventData(prev => ({
//                               ...prev,
//                               date: e.target.value
//                             }))}
//                             className="bg-gray-700/30 rounded-lg px-3 py-2 text-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 w-36"
//                           />
//                           <input
//                             type="time"
//                             value={mockEventData.startTime}
//                             onChange={(e) => setMockEventData(prev => ({
//                               ...prev,
//                               startTime: e.target.value
//                             }))}
//                             className="bg-gray-700/30 rounded-lg px-3 py-2 text-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 w-32"
//                           />
//                           <div className="bg-gray-700/30 px-3 py-2 rounded-lg">
//                             <div className="text-xs text-gray-400">GMT+05:30</div>
//                             <div className="text-xs text-gray-400">Calcutta</div>
//                           </div>
//                         </div>
//                       </div>

//                       {/* End Time */}
//                       <div className="flex items-center space-x-3">
//                         <div className="w-2 h-2 rounded-full border border-green-500"></div>
//                         <div className="flex items-center space-x-2 flex-1">
//                           <input
//                             type="date"
//                             value={mockEventData.date}
//                             onChange={(e) => setMockEventData(prev => ({
//                               ...prev,
//                               date: e.target.value
//                             }))}
//                             className="bg-gray-700/30 rounded-lg px-3 py-2 text-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 w-36"
//                           />
//                           <input
//                             type="time"
//                             value={mockEventData.endTime}
//                             onChange={(e) => setMockEventData(prev => ({
//                               ...prev,
//                               endTime: e.target.value
//                             }))}
//                             className="bg-gray-700/30 rounded-lg px-3 py-2 text-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 w-32"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Location */}
//                     <div 
//                       onClick={() => setIsLocationModalOpen(true)}
//                       className="bg-gray-700/30 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-700/40 transition-colors"
//                     >
//                       <div className="flex items-center text-gray-400">
//                         <MapPin className="w-4 h-4 mr-2" />
//                         <span className="text-sm">
//                           {mockEventData.location || "Add offline location or virtual link"}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Description */}
//                     <div 
//                       onClick={() => setIsDescriptionModalOpen(true)}
//                       className="bg-gray-700/30 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-700/40 transition-colors"
//                     >
//                       <div className="flex items-center text-gray-400">
//                         <FileText className="w-4 h-4 mr-2" />
//                         <span className="text-sm">
//                           {mockEventData.description ? mockEventData.description : "Add Description"}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Event Options */}
//                     <div className="space-y-2">
//                       <div className="text-sm text-gray-300 mb-2">Event Options</div>
                      
//                       {/* Ticket Type */}
//                       <motion.div
//                         className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/40 transition-colors"
//                         whileHover={{ scale: 1.01 }}
//                         onClick={() => setMockEventData(prev => ({
//                           ...prev,
//                           ticketType: prev.ticketType === 'Free' ? 'Paid' : 'Free'
//                         }))}
//                       >
//                         <div className="flex items-center space-x-2">
//                           <Ticket className="w-4 h-4 text-gray-400" />
//                           <span className="text-sm text-gray-300">Ticket Type</span>
//                         </div>
//                         <span className="text-sm text-gray-400">{mockEventData.ticketType}</span>
//                       </motion.div>

//                       {/* Capacity */}
//                       <motion.div
//                         className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/40 transition-colors"
//                         whileHover={{ scale: 1.01 }}
//                         onClick={() => setIsCapacityModalOpen(true)}
//                       >
//                         <div className="flex items-center space-x-2">
//                           <Users className="w-4 h-4 text-gray-400" />
//                           <span className="text-sm text-gray-300">Capacity</span>
//                         </div>
//                         <span className="text-sm text-gray-400">{mockEventData.capacity}</span>
//                       </motion.div>

//                       {/* Approval Required */}
//                       <motion.div
//                         className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/40 transition-colors"
//                         whileHover={{ scale: 1.01 }}
//                         onClick={() => setMockEventData(prev => ({
//                           ...prev,
//                           requireApproval: !prev.requireApproval
//                         }))}
//                       >
//                         <div className="flex items-center space-x-2">
//                           <UserCheck className="w-4 h-4 text-gray-400" />
//                           <span className="text-sm text-gray-300">Require Approval</span>
//                         </div>
//                         <motion.div 
//                           className={`w-10 h-5 rounded-full transition-colors ${
//                             mockEventData.requireApproval ? 'bg-green-500' : 'bg-gray-600'
//                           }`}
//                         >
//                           <motion.div
//                             className="w-4 h-4 bg-white rounded-full m-0.5"
//                             animate={{ x: mockEventData.requireApproval ? 20 : 0 }}
//                             transition={{ type: "spring", stiffness: 500, damping: 30 }}
//                           />
//                         </motion.div>
//                       </motion.div>
//                     </div>

//                     {/* Create Button */}
//                     <motion.button
//                       whileHover={{ scale: 1.01 }}
//                       whileTap={{ scale: 0.98 }}
//                       className="w-full bg-white text-gray-900 py-3 rounded-lg font-medium text-sm"
//                       onClick={() => {
//                         const newEvent: Event = {
//                           id: Math.random().toString(36).substr(2, 9),
//                           title: mockEventData.title || 'Untitled Event',
//                           description: mockEventData.description || 'No description provided',
//                           date: mockEventData.date,
//                           time: mockEventData.startTime,
//                           location: mockEventData.location || 'Location TBD',
//                           capacity: mockEventData.capacity,
//                           coverImage: mockEventData.coverImage,
//                           eventType: mockEventData.isPublic ? 'public' : 'private',
//                           attendees: 0,
//                           createdAt: new Date()
//                         };

//                         // Add the new event to the events list
//                         setEvents(prev => [newEvent, ...prev]);

//                         // Show success notification
//                         const notification = {
//                           id: Math.random().toString(36).substr(2, 9),
//                           eventId: newEvent.id,
//                           message: "Event created successfully! 🎉"
//                         };
//                         setNotifications(prev => [...prev, notification]);

//                         // Clear mock event data
//                         setMockEventData({
//                           title: '',
//                           date: '2025-05-03',
//                           startTime: '18:00',
//                           endTime: '19:00',
//                           location: '',
//                           description: '',
//                           isPublic: true,
//                           theme: 'minimal',
//                           coverImage: null,
//                           capacity: 'Unlimited',
//                           requireApproval: false,
//                           ticketType: 'Free'
//                         });

//                         // Remove notification after 3 seconds
//                         setTimeout(() => {
//                           setNotifications(prev => 
//                             prev.filter(n => n.id !== notification.id)
//                           );
//                         }, 3000);

//                         // Scroll to discover section
//                         document.getElementById('discover')?.scrollIntoView({ 
//                           behavior: 'smooth' 
//                         });
//                       }}
//                     >
//                       Create Event
//                     </motion.button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Discover Section */}
//       <section id="discover" className="py-16 relative z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Discover Events</h2>
//             <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//               Browse through upcoming events and join the ones that interest you.
//             </p>
//           </div>

//           {events.length === 0 ? (
//             <div className="text-center py-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl">
//               <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//               <h3 className="text-xl font-medium text-gray-300">No events yet</h3>
//               <p className="text-gray-400 mt-2">Be the first to create an event!</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {events.map((event) => (
//                 <div 
//                   key={event.id}
//                   className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 relative"
//                 >
     
//                   <AnimatePresence>
//                     {notifications.map(notification => 
//                       notification.eventId === event.id && (
//                         <motion.div
//                           key={notification.id}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -20 }}
//                           className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50"
//                         >
//                           <div className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
//                             <span>{notification.message}</span>
//                           </div>
//                         </motion.div>
//                       )
//                     )}
//                   </AnimatePresence>

//                   {/* Event Cover Image */}
//                   <div className="relative h-48">
//                     {event.coverImage ? (
//                       <img 
//                         src={event.coverImage}
//                         alt={event.title}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 flex items-center justify-center">
//                         <Calendar className="w-12 h-12 text-gray-400" />
//                       </div>
//                     )}
//                     <div className="absolute top-4 right-4">
//                       <span className="px-3 py-1 rounded-full bg-purple-900/50 text-purple-300 text-xs font-medium">
//                         {event.eventType}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Event Details */}
//                   <div className="p-6">
//                     <h3 className="text-xl font-semibold text-white mb-2">
//                       {event.title}
//                     </h3>
//                     <p className="text-gray-400 text-sm line-clamp-2 mb-4">
//                       {event.description}
//                     </p>

//                     <div className="space-y-3">
//                       <div className="flex items-center text-gray-300">
//                         <CalendarDays className="w-4 h-4 mr-2 text-purple-400" />
//                         <span className="text-sm">{event.date} • {event.time}</span>
//                       </div>
//                       <div className="flex items-center text-gray-300">
//                         <MapPin className="w-4 h-4 mr-2 text-purple-400" />
//                         <span className="text-sm">{event.location}</span>
//                       </div>
//                       {event.capacity && (
//                         <div className="flex items-center text-gray-300">
//                           <Users className="w-4 h-4 mr-2 text-purple-400" />
//                           <span className="text-sm">{event.capacity} spots available</span>
//                         </div>
//                       )}
//                     </div>

//                     <div className="mt-4">
//                       <div className="flex items-center">
//                         <div className="flex -space-x-2 overflow-hidden">
//                           {eventAttendees[event.id]?.slice(0, 5).map((attendee, index) => (
//                             <motion.div
//                               key={index}
//                               initial={{ opacity: 0, x: -10 }}
//                               animate={{ opacity: 1, x: 0 }}
//                               transition={{ delay: index * 0.1 }}
//                               className="relative group"
//                             >
//                               <img
//                                 src={attendee.avatar}
//                                 alt={attendee.name}
//                                 className="w-8 h-8 rounded-full border-2 border-gray-800 hover:z-10 transition-all duration-200"
//                               />
//                               <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
//                                 {attendee.name}
//                               </div>
//                             </motion.div>
//                           ))}
//                           {event.attendees > 5 && (
//                             <motion.div
//                               initial={{ opacity: 0, x: -10 }}
//                               animate={{ opacity: 1, x: 0 }}
//                               transition={{ delay: 0.5 }}
//                               className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-xs text-white"
//                             >
//                               +{event.attendees - 5}
//                             </motion.div>
//                           )}
//                         </div>
//                         <motion.span 
//                           className="ml-3 text-gray-400 text-sm"
//                           animate={{ scale: [1, 1.2, 1] }}
//                           transition={{ duration: 0.3 }}
//                           key={event.attendees}
//                         >
//                           {event.attendees} attending
//                         </motion.span>
//                       </div>
//                     </div>

//                     <div className="mt-6 flex justify-between items-center">
//                       <button 
//                         onClick={() => {
//                           setSelectedEvent(event);
//                           setShowRsvpModal(true);
//                         }}
//                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 
//                           ${rsvpdEvents.includes(event.id)
//                             ? 'bg-purple-600 text-white'
//                             : 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30'
//                           }`}
//                         disabled={rsvpdEvents.includes(event.id)}
//                       >
//                         {rsvpdEvents.includes(event.id) ? (
//                           <span className="flex items-center">
//                             <Check className="w-4 h-4 mr-2" />
//                             Going
//                           </span>
//                         ) : (
//                           'RSVP Now'
//                         )}
//                       </button>
//                       <motion.span 
//                         className="text-gray-400 text-sm"
//                         animate={{ scale: [1, 1.2, 1] }}
//                         transition={{ duration: 0.3 }}
//                         key={event.attendees}
//                       >
//                         {event.attendees} attending
//                       </motion.span>
//                     </div>
//                   </div>

//                   {/* Add a tooltip for new RSVPs */}
//                   <AnimatePresence>
//                     {rsvpdEvents.includes(event.id) && (
//                       <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white"
//                       >
//                         You're going! 🎉
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>


//       {/* RSVP Modal */}
//       <AnimatePresence>
//         {showRsvpModal && selectedEvent && (
//           <RsvpModal 
//             event={selectedEvent} 
//             onClose={() => {
//               setShowRsvpModal(false);
//               setSelectedEvent(null);
//               setRsvpStatus(null);
//               setGuestCount(1);
//             }} 
//           />
//         )}
//       </AnimatePresence>

//       {/* Calendar Modal */}
//       <AnimatePresence>
//         {isCalendarModalOpen && (
//           <CalendarModal 
//             isOpen={isCalendarModalOpen}
//             onClose={() => setIsCalendarModalOpen(false)}
//           />
//         )}
//       </AnimatePresence>

//       {/* Description Modal */}
//       <PopupModal 
//         isOpen={isDescriptionModalOpen} 
//         onClose={() => setIsDescriptionModalOpen(false)}
//         title="Add Description"
//       >
//         <div className="space-y-6">
//           <textarea 
//             value={mockEventData.description}
//             onChange={(e) => setMockEventData(prev => ({
//               ...prev,
//               description: e.target.value
//             }))}
//             className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//             placeholder="Describe your event..."
//             rows={6}
//           />
//           <motion.button
//             whileHover={{ scale: 1.01 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => setIsDescriptionModalOpen(false)}
//             className="w-full bg-white text-gray-900 py-2 rounded-lg font-medium"
//           >
//             Save
//           </motion.button>
//         </div>
//       </PopupModal>

//       {/* Location Modal */}
//       <PopupModal
//         isOpen={isLocationModalOpen}
//         onClose={() => setIsLocationModalOpen(false)}
//         title="Add Location"
//       >
//         <div className="space-y-6">
//           <input
//             type="text"
//             value={locationInput}
//             onChange={(e) => setLocationInput(e.target.value)}
//             className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//             placeholder="Enter location or meeting link"
//           />
//           <motion.button
//             whileHover={{ scale: 1.01 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => {
//               setMockEventData(prev => ({
//                 ...prev,
//                 location: locationInput
//               }));
//               setIsLocationModalOpen(false);
//             }}
//             className="w-full bg-white text-gray-900 py-2 rounded-lg font-medium"
//           >
//             Save
//           </motion.button>
//         </div>
//       </PopupModal>

//       {/* Notifications */}
//       <AnimatePresence>
//         {notifications.map(notification => (
//           <motion.div
//             key={notification.id}
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 50 }}
//             className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg"
//           >
//             {notification.message}
//           </motion.div>
//         ))}
//       </AnimatePresence>

//       {/* Footer */}
//       <footer className="relative z-10 border-t border-gray-800/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
//             {/* Left Section - Logo & Description */}
//             <div>
//               <div className="flex items-center space-x-3 group">
//                 <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300">
//                   <Calendar className="h-5 w-5 text-white" />
//                 </div>
//                 <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text">
//                   Gatherion
//                 </span>
//               </div>
//               <p className="mt-4 text-gray-400 max-w-md text-sm">
//                 Bringing people together through Gatherion's seamless event planning and unforgettable experiences.
//               </p>
//             </div>

//             {/* Right Section - Quick Links */}
//             <div className="grid grid-cols-2 gap-8">
//               <div>
//                 <h3 className="text-sm font-medium text-white mb-4">Links</h3>
//                 <ul className="space-y-3">
//                   {[
//                     { label: 'About', icon: <User className="w-4 h-4" /> },
//                     { label: 'Events', icon: <Calendar className="w-4 h-4" /> },
//                     { label: 'Blog', icon: <FileText className="w-4 h-4" /> },
//                     { label: 'Contact', icon: <Mail className="w-4 h-4" /> }
//                   ].map((item) => (
//                     <li key={item.label}>
//                       <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center space-x-2 group">
//                         <span className="text-purple-500 group-hover:text-purple-400 transition-colors">
//                           {item.icon}
//                         </span>
//                         <span className="text-sm">{item.label}</span>
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {/* Social Links */}
//               <div>
//                 <h3 className="text-sm font-medium text-white mb-4">Connect</h3>
//                 <div className="flex flex-wrap gap-3">
//                   {[
//                     { label: 'Twitter', icon: <Twitter className="w-4 h-4" />, color: 'hover:bg-blue-500' },
//                     { label: 'GitHub', icon: <Github className="w-4 h-4" />, color: 'hover:bg-gray-700' },
//                     { label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, color: 'hover:bg-blue-600' },
//                     { label: 'Instagram', icon: <Instagram className="w-4 h-4" />, color: 'hover:bg-pink-600' }
//                   ].map((social) => (
//                     <a
//                       key={social.label}
//                       href="#"
//                       className={`w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center 
//                         ${social.color} transition-colors group`}
//                       aria-label={social.label}
//                     >
//                       <span className="text-gray-400 group-hover:text-white transition-colors">
//                         {social.icon}
//                       </span>
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Bottom Bar */}
//           <div className="mt-8 pt-6 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center">
//             <div className="flex items-center space-x-2 text-sm text-gray-400">
//               <span>© {new Date().getFullYear()} Gatherion.</span>
//               <span className="hidden md:inline">•</span>
//               <span className="bg-gradient-to-r from-purple-400 to-indigo-500 text-transparent bg-clip-text font-medium">
//                 Developed by Anjali Jayakumar
//               </span>
//             </div>
            
//             <div className="mt-4 md:mt-0 flex items-center space-x-4 text-sm text-gray-400">
//               <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
//               <span>•</span>
//               <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
//             </div>
//           </div>

//           {/* Decorative gradient line */}
//           <div className="absolute bottom-0 left-0 right-0">
//             <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>
//             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 blur-sm opacity-20"></div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }