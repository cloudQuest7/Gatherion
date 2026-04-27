'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { springTransition } from '@/lib/animations';

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const PopupModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: PopupModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={springTransition}
            className="bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-lg relative z-50 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-700/50 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white tracking-tight">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-700/50 transition-all active:scale-95 group"
                title="Close"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupModal;
