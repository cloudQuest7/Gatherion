'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import PopupModal from '@/components/common/PopupModal';
import { springTransition } from '@/lib/animations';
import { Event } from '@/types';

interface RsvpModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const RsvpModal = ({ event, isOpen, onClose, onConfirm }: RsvpModalProps) => {
  const [localRsvpStatus, setLocalRsvpStatus] = useState<'going' | 'maybe' | 'not-going' | null>(null);
  const [localGuestCount, setLocalGuestCount] = useState(1);
  const [localDietaryRestrictions, setLocalDietaryRestrictions] = useState('');
  const [localAdditionalNotes, setLocalAdditionalNotes] = useState('');

  const handleSubmit = () => {
    onConfirm();
    onClose();
  };

  return (
    <PopupModal
      isOpen={isOpen}
      onClose={onClose}
      title={`RSVP for ${event.title}`}
    >
      <div className="space-y-6">
        <div className="relative h-40 -mx-6 -mt-6 mb-6 overflow-hidden">
          <Image
            src={event.coverImage || '/default-event-cover.jpg'}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent" />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-400 uppercase tracking-wider">
              Will you attend?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['going', 'maybe', 'not-going'].map((status) => (
                <button
                  key={status}
                  onClick={() => setLocalRsvpStatus(status as 'going' | 'maybe' | 'not-going')}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                    ${localRsvpStatus === status 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20 ring-2 ring-purple-400/20' 
                      : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {(localRsvpStatus === 'going' || localRsvpStatus === 'maybe') && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={springTransition}
                className="space-y-4 overflow-hidden"
              >
                <div className="h-px bg-gray-700/50 my-2" />
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-400">
                    Number of Guests
                  </label>
                  <div className="flex items-center space-x-4 bg-gray-900/50 rounded-xl p-1 border border-gray-700/50">
                    <button
                      onClick={() => setLocalGuestCount(Math.max(1, localGuestCount - 1))}
                      className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4 rotate-45" />
                    </button>
                    <span className="text-white font-semibold w-4 text-center">{localGuestCount}</span>
                    <button
                      onClick={() => setLocalGuestCount(Math.min(parseInt(event.capacity) || 10, localGuestCount + 1))}
                      className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">
                    Dietary Restrictions
                  </label>
                  <input
                    type="text"
                    value={localDietaryRestrictions}
                    onChange={(e) => setLocalDietaryRestrictions(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    placeholder="Vegetarian, vegan, allergies, etc."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-400">
                    Additional Notes
                  </label>
                  <textarea
                    value={localAdditionalNotes}
                    onChange={(e) => setLocalAdditionalNotes(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    placeholder="Any special requests?"
                    rows={2}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!localRsvpStatus}
            className="w-full px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 
              text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transition-all duration-300"
          >
            Confirm RSVP
          </motion.button>
        </div>
      </div>
    </PopupModal>
  );
};

export default RsvpModal;
