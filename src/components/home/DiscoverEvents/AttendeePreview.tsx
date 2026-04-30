'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { UserProfile } from '@/types';

interface AttendeePreviewProps {
  attendees: UserProfile[];
  totalAttendees: number;
}

const AttendeePreview = ({ attendees, totalAttendees }: AttendeePreviewProps) => {
  const displayAttendees = attendees.slice(0, 5);
  const remainingCount = totalAttendees - displayAttendees.length;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2 overflow-hidden">
        {displayAttendees.map((attendee, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="relative">
              <Image
                src={attendee.avatar}
                alt={attendee.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-gray-800 hover:z-10 transition-all duration-200 object-cover"
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {attendee.name}
              </div>
            </div>
          </motion.div>
        ))}
        {remainingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-xs text-white"
          >
            +{remainingCount}
          </motion.div>
        )}
      </div>
      <motion.span 
        className="ml-3 text-gray-400 text-sm"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.3 }}
        key={totalAttendees}
      >
        {totalAttendees} attending
      </motion.span>
    </div>
  );
};

export default AttendeePreview;
