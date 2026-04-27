'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '@/types';

interface NotificationToastProps {
  notifications: Notification[];
}

const NotificationToast = ({ notifications }: NotificationToastProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none space-y-2">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow-2xl pointer-events-auto min-w-[200px] flex items-center justify-between gap-4"
          >
            <span className="font-medium">{notification.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
