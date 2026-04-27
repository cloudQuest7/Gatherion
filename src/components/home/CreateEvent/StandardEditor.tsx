'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, MapPin, Users, Plus } from 'lucide-react';
import { StandardEventData } from '@/types';
import { springTransition } from '@/lib/animations';

interface StandardEditorProps {
  formStep: number;
  setFormStep: (step: number) => void;
  eventData: StandardEventData;
  setEventData: React.Dispatch<React.SetStateAction<StandardEventData>>;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
}

const StandardEditor = ({
  formStep,
  setFormStep,
  eventData,
  setEventData,
  handleSubmit,
  handleChange,
  handleFileChange,
  handleNextStep,
  handlePrevStep
}: StandardEditorProps) => {
  return (
    <motion.div 
      key="standard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={springTransition}
      className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl p-6 md:p-10 max-w-4xl mx-auto"
    >
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          {/* Background Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 -translate-y-1/2 -z-10" />
          {/* Active Line */}
          <motion.div 
            className="absolute top-1/2 left-0 h-0.5 bg-purple-500 -translate-y-1/2 -z-10"
            initial={{ width: '0%' }}
            animate={{ width: `${((formStep - 1) / 2) * 100}%` }}
            transition={springTransition}
          />
          
          {['Details', 'Time', 'Info'].map((step, index) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                  formStep > index + 1 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : formStep === index + 1 
                      ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-gray-800 border-gray-700 text-gray-500'
                }`}
              >
                {formStep > index + 1 ? <Check className="w-5 h-5" /> : index + 1}
              </motion.div>
              <span className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-500 ${
                formStep === index + 1 ? 'text-purple-400' : 'text-gray-500'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Event Details */}
          {formStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={springTransition}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Event Name
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="e.g. Annual Tech Summit"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Event Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['public', 'private'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEventData(prev => ({ ...prev, eventType: type }))}
                      className={`px-5 py-3.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${
                        eventData.eventType === type 
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20 ring-2 ring-purple-400/20' 
                          : 'bg-gray-900/50 border border-gray-700/50 text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-5 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder-gray-600"
                  placeholder="What's this event about?"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Date & Time */}
          {formStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={springTransition}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={eventData.date}
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={eventData.time}
                    onChange={handleChange}
                    className="w-full px-5 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Duration
                </label>
                <div className="relative">
                  <select
                    className="w-full px-5 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none transition-all cursor-pointer"
                  >
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                    <option value="4">4 hours</option>
                    <option value="custom">Custom</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Additional Info */}
          {formStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={springTransition}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="location"
                    value={eventData.location}
                    onChange={handleChange}
                    className="w-full pl-12 pr-5 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-gray-600"
                    placeholder="Venue name or online link"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Capacity
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    name="capacity"
                    value={eventData.capacity}
                    onChange={handleChange}
                    min="1"
                    className="w-full pl-12 pr-5 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder-gray-600"
                    placeholder="Max attendees"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Cover Image
                </label>
                <motion.div
                  whileHover={{ scale: 1.005, borderColor: 'rgba(168, 85, 247, 0.4)' }}
                  whileTap={{ scale: 0.995 }}
                  onClick={() => document.getElementById('coverImage')?.click()}
                  className="w-full h-40 border-2 border-dashed border-gray-700/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-gray-900/30 hover:bg-gray-900/50 transition-all group"
                >
                  {eventData.coverImage ? (
                    <div className="relative w-full h-full p-2">
                      <img src={eventData.coverImage} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                        <p className="text-white text-sm font-medium">Change Image</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Plus className="w-8 h-8 text-gray-500 group-hover:text-purple-400 transition-colors mb-2" />
                      <span className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors">Click to upload cover image</span>
                    </>
                  )}
                </motion.div>
                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-700/50">
          <div>
            {formStep > 1 && (
              <motion.button
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handlePrevStep}
                className="flex items-center text-gray-400 hover:text-white font-semibold transition-colors"
              >
                <ChevronDown className="w-5 h-5 rotate-90 mr-1" />
                Back
              </motion.button>
            )}
          </div>
          
          <div className="flex gap-4">
            {formStep < 3 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleNextStep}
                className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-600/20 hover:bg-purple-500 transition-all flex items-center"
              >
                Next Step
                <ChevronDown className="w-5 h-5 -rotate-90 ml-1" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-purple-600/20 hover:shadow-purple-600/40 transition-all"
              >
                Create Event
              </motion.button>
            )}
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default StandardEditor;
