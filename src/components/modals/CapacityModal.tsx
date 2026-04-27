'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Check } from 'lucide-react';
import PopupModal from '@/components/common/PopupModal';
import { MockEventData } from '@/types';

interface CapacityModalProps {
  isOpen: boolean;
  onClose: () => void;
  mockEventData: MockEventData;
  setMockEventData: React.Dispatch<React.SetStateAction<MockEventData>>;
}

const CapacityModal = ({ isOpen, onClose, mockEventData, setMockEventData }: CapacityModalProps) => {
  const [capacityType, setCapacityType] = useState(mockEventData.capacity === 'Unlimited' ? 'unlimited' : 'limited');
  const [capacityValue, setCapacityValue] = useState(
    mockEventData.capacity === 'Unlimited' ? '' : mockEventData.capacity
  );

  const handleSave = () => {
    setMockEventData(prev => ({
      ...prev,
      capacity: capacityType === 'unlimited' ? 'Unlimited' : capacityValue
    }));
    onClose();
  };

  return (
    <PopupModal
      isOpen={isOpen}
      onClose={onClose}
      title="Set Event Capacity"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div 
            onClick={() => setCapacityType('unlimited')}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              capacityType === 'unlimited' 
                ? 'bg-green-900/20 border border-green-500/50' 
                : 'bg-gray-700/30 hover:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Unlimited capacity</span>
              </div>
              {capacityType === 'unlimited' && (
                <Check className="w-4 h-4 text-green-400" />
              )}
            </div>
          </div>

          <div 
            onClick={() => setCapacityType('limited')}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              capacityType === 'limited' 
                ? 'bg-green-900/20 border border-green-500/50' 
                : 'bg-gray-700/30 hover:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">Limited capacity</span>
              </div>
              {capacityType === 'limited' && (
                <Check className="w-4 h-4 text-green-400" />
              )}
            </div>
            
            {capacityType === 'limited' && (
              <div className="mt-3">
                <input
                  type="number"
                  min="1"
                  value={capacityValue}
                  onChange={(e) => setCapacityValue(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter maximum capacity"
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleSave}
          className="w-full bg-white text-gray-900 py-2 rounded-lg font-medium"
          disabled={capacityType === 'limited' && !capacityValue}
        >
          Save
        </motion.button>
      </div>
    </PopupModal>
  );
};

export default CapacityModal;
