'use client';

import { motion, AnimatePresence } from 'framer-motion';
import InterfaceSwitch from '@/components/common/InterfaceSwitch';
import StandardEditor from './StandardEditor';
import ModernEditor from './ModernEditor';
import { StandardEventData, MockEventData, Theme, Event, Notification } from '@/types';

interface CreateEventSectionProps {
  interfaceType: 'standard' | 'mock';
  setInterfaceType: (type: 'standard' | 'mock') => void;
  formStep: number;
  setFormStep: (step: number) => void;
  eventData: StandardEventData;
  setEventData: React.Dispatch<React.SetStateAction<StandardEventData>>;
  mockEventData: MockEventData;
  setMockEventData: React.Dispatch<React.SetStateAction<MockEventData>>;
  themes: Theme[];
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  setIsLocationModalOpen: (isOpen: boolean) => void;
  setIsDescriptionModalOpen: (isOpen: boolean) => void;
  setIsCapacityModalOpen: (isOpen: boolean) => void;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const CreateEventSection = ({
  interfaceType,
  setInterfaceType,
  formStep,
  setFormStep,
  eventData,
  setEventData,
  mockEventData,
  setMockEventData,
  themes,
  handleSubmit,
  handleChange,
  handleFileChange,
  handleNextStep,
  handlePrevStep,
  setIsLocationModalOpen,
  setIsDescriptionModalOpen,
  setIsCapacityModalOpen,
  setEvents,
  setNotifications
}: CreateEventSectionProps) => {
  return (
    <section id="create" className="py-32 relative z-10 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-light text-white italic tracking-tight">create.</h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">crafting the perfect invitation</p>
          </motion.div>
        </div>

        {/* Interface Switch */}
        <div className="mb-16">
          <InterfaceSwitch 
            interfaceType={interfaceType} 
            setInterfaceType={setInterfaceType} 
          />
        </div>

        {/* Conditional Rendering */}
        <AnimatePresence mode="wait">
          {interfaceType === 'standard' ? (
            <StandardEditor
              formStep={formStep}
              setFormStep={setFormStep}
              eventData={eventData}
              setEventData={setEventData}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
            />
          ) : (
            <ModernEditor
              mockEventData={mockEventData}
              setMockEventData={setMockEventData}
              themes={themes}
              setIsLocationModalOpen={setIsLocationModalOpen}
              setIsDescriptionModalOpen={setIsDescriptionModalOpen}
              setIsCapacityModalOpen={setIsCapacityModalOpen}
              setEvents={setEvents}
              setNotifications={setNotifications}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CreateEventSection;
