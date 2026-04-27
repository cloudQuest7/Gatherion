'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PopupModal from '@/components/common/PopupModal';
import { Notification } from '@/types';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const CalendarModal = ({ isOpen, onClose, setNotifications }: CalendarModalProps) => {
  const [localCalendarData, setLocalCalendarData] = useState({
    name: '',
    description: '',
    tintColor: '#00C853'
  });

  const tintColors = [
    '#E0E0E0', '#FF80AB', '#EA80FC', '#8C9EFF', 
    '#82B1FF', '#00C853', '#FFD740', '#FFAB40', '#FF5252'
  ];

  const handleCreateCalendar = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCalendarId = Math.random().toString(36).slice(2, 11);
    
    const notification = {
      id: Math.random().toString(36).slice(2, 11),
      eventId: newCalendarId,
      message: "Calendar created successfully! 🗓️"
    };
    setNotifications(prev => [...prev, notification]);

    setLocalCalendarData({
      name: '',
      description: '',
      tintColor: '#00C853'
    });
    onClose();

    setTimeout(() => {
      setNotifications(prev => 
        prev.filter(n => n.id !== notification.id)
      );
    }, 2500);
  };

  return (
    <PopupModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Calendar"
    >
      <form onSubmit={handleCreateCalendar} className="space-y-6">
        <div>
          <input
            type="text"
            value={localCalendarData.name}
            onChange={(e) => setLocalCalendarData(prev => ({ 
              ...prev, 
              name: e.target.value 
            }))}
            className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Calendar Name"
          />
        </div>

        <div>
          <textarea
            value={localCalendarData.description}
            onChange={(e) => setLocalCalendarData(prev => ({ 
              ...prev, 
              description: e.target.value 
            }))}
            className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Add a short description"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tint Color
          </label>
          <div className="flex flex-wrap gap-2">
            {tintColors.map((color) => (
              <button
                type="button"
                key={color}
                onClick={() => setLocalCalendarData(prev => ({ 
                  ...prev, 
                  tintColor: color 
                }))}
                className={`w-8 h-8 rounded-full transition-all ${
                  localCalendarData.tintColor === color 
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' 
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-white text-gray-900 py-3 rounded-lg font-medium"
          disabled={!localCalendarData.name}
        >
          Create Calendar
        </motion.button>
      </form>
    </PopupModal>
  );
};

export default CalendarModal;
