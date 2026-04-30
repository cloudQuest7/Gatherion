'use client';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.33, 1, 0.68, 1] as const,
    },
  },
};

const FloatingOrb = ({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) => (
  <motion.div
    animate={{
      y: [0, -30, 0],
      rotate: [0, 10, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: 'easeInOut',
    }}
    className={`absolute blur-3xl rounded-full ${className}`}
  />
);

export default function BentoFeatures() {
  return (
    <section className="relative overflow-hidden bg-black py-16 md:py-24 lg:py-32">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0">
        <FloatingOrb
          className="h-[300px] w-[300px] md:h-[600px] md:w-[600px] bg-violet-900/20 top-[-100px] left-[-100px] md:top-[-200px] md:left-[-200px]"
          delay={0}
        />
        <FloatingOrb
          className="h-[200px] w-[200px] md:h-[400px] md:w-[400px] bg-fuchsia-900/10 bottom-[-50px] right-[-50px] md:bottom-[-100px] md:right-[-100px]"
          delay={2}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center md:mb-16 lg:mb-20"
        >
          <h2 className="mb-4 text-3xl font-light italic tracking-tight text-white md:mb-6 md:text-5xl lg:text-7xl">
            Everything you need to{' '}
            <span className="not-italic text-[#B175FF]">gather</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-zinc-500 md:text-base lg:text-lg">
            Powerful tools wrapped in a serene interface.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-2 md:auto-rows-[minmax(200px,auto)] md:gap-6 lg:grid-cols-4"
        >
          {/* Large Feature Card - Modern Redesign */}
          <motion.div
            variants={itemVariants}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:shadow-[0_20px_80px_rgba(120,80,255,0.18)] md:rounded-[2.5rem] md:p-8 lg:col-span-2 lg:row-span-2"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(177,117,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_30%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent" />
            <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                

                {/* Modern planner UI */}
                <div className="mb-6 rounded-2xl border border-white/10 bg-black/30 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:mb-8 md:rounded-[2rem] md:p-4">
                  <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 md:text-[11px]">
                        Saturday evening
                      </p>
                      <h4 className="mt-1 text-sm font-medium text-white md:text-base">
                        Rooftop Dinner
                      </h4>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-zinc-300 md:text-xs">
                      Draft
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-2xl bg-white/[0.04] p-3">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-[#B175FF]/15 flex items-center justify-center text-[#C99BFF]">
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V3m8 4V3M4 11h16M6 5h12a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[11px] text-zinc-500 md:text-xs">Timeline</p>
                          <p className="text-xs font-medium text-white md:text-sm">
                            7:30 PM arrival
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                          <span className="text-[11px] text-zinc-400 md:text-xs">Guests</span>
                          <span className="text-[11px] font-medium text-white md:text-xs">24 invited</span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                          <span className="text-[11px] text-zinc-400 md:text-xs">Theme</span>
                          <span className="text-[11px] font-medium text-white md:text-xs">Warm minimal</span>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                          <span className="text-[11px] text-zinc-400 md:text-xs">Venue</span>
                          <span className="text-[11px] font-medium text-white md:text-xs">Skyline Terrace</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/[0.04] p-3">
                      <p className="mb-3 text-[11px] text-zinc-500 md:text-xs">Progress</p>
                      <div className="mb-4 flex items-end gap-1.5 h-20">
                        {[38, 60, 52, 72, 84].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.15 * i }}
                            className="flex-1 rounded-full bg-gradient-to-t from-[#8B5CF6] to-[#C084FC]"
                          />
                        ))}
                      </div>

                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                          AI suggestion
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                          Add a candlelit dinner layout and soft lavender accents for a calmer atmosphere.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="mb-2 text-xl font-semibold tracking-tight text-white md:mb-4 md:text-3xl">
                  Intuitive Planning
                </h3>
                <p className="max-w-xl text-xs leading-relaxed text-zinc-400 md:text-base">
                  Shape your entire event from one calm workspace, with smart suggestions, clear structure, and a modern flow that never feels overwhelming.
                </p>
              </div>

            </div>
          </motion.div>

          {/* Medium Feature Cards */}
          <motion.div
            variants={itemVariants}
            className="relative group overflow-hidden rounded-xl md:rounded-[2rem] p-5 md:p-6 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-white/5 backdrop-blur-xl transition-all duration-500 hover:border-[#B175FF]/50 hover:shadow-[0_0_20px_rgba(177,117,255,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="relative z-10">
              <div className="mb-4 space-y-2 md:mb-6 md:space-y-3">
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-2 md:p-3">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white md:text-sm">Sarah Johnson</p>
                    <p className="text-xs text-zinc-400">RSVP Confirmed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-2 md:p-3">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white md:text-sm">Mike Chen</p>
                    <p className="text-xs text-zinc-400">Pending</p>
                  </div>
                </div>
              </div>

              <h3 className="mb-2 text-lg font-bold text-white md:mb-3 md:text-xl">Seamless RSVPs</h3>
              <p className="text-xs leading-relaxed text-zinc-500 md:text-sm">
                Track responses, manage approvals, and send automated reminders.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative group overflow-hidden rounded-xl md:rounded-[2rem] p-5 md:p-6 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-white/5 backdrop-blur-xl transition-all duration-500 hover:border-pink-400/50 hover:shadow-[0_0_20px_rgba(244,114,182,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="relative z-10">
              <div className="mb-4 flex h-12 items-center justify-center gap-1 rounded-lg border border-pink-500/20 bg-black/40 md:mb-6 md:h-16 md:rounded-xl">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ['12px', '24px', '12px'] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                    className="w-0.5 rounded-full bg-gradient-to-t from-pink-500 to-rose-400 md:w-1"
                  />
                ))}
              </div>

              <h3 className="mb-2 text-lg font-bold text-white md:mb-3 md:text-xl">Guest Management</h3>
              <p className="text-xs leading-relaxed text-zinc-500 md:text-sm">
                Organize attendees and manage capacity effortlessly.
              </p>
            </div>
          </motion.div>

          {/* Small Feature Cards */}
          <motion.div
            variants={itemVariants}
            className="relative group overflow-hidden rounded-xl md:rounded-[2rem] p-5 md:p-6 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 backdrop-blur-xl transition-all duration-500 hover:border-pink-400/60 hover:shadow-[0_0_20px_rgba(244,114,182,0.2)]"
          >
            <div className="mb-4 space-y-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
              >
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-purple-400 md:h-3 md:w-3" />
                  <div className="h-2 w-2 rounded-full bg-pink-400 md:h-3 md:w-3" />
                  <div className="h-2 w-2 rounded-full bg-indigo-400 md:h-3 md:w-3" />
                </div>
                <span className="text-xs font-semibold text-white md:text-sm">Cosmic</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
              >
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-cyan-400 md:h-3 md:w-3" />
                  <div className="h-2 w-2 rounded-full bg-blue-400 md:h-3 md:w-3" />
                  <div className="h-2 w-2 rounded-full bg-slate-500 md:h-3 md:w-3" />
                </div>
                <span className="text-xs font-semibold text-white md:text-sm">Minimal</span>
              </motion.div>
            </div>

            <h3 className="mb-2 text-base font-bold text-white md:text-lg">Beautiful Themes</h3>
            <p className="text-xs leading-relaxed text-zinc-500">
              Choose your event vibe instantly.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative group overflow-hidden rounded-xl md:rounded-[2rem] p-5 md:p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-xl transition-all duration-500 hover:border-blue-400/60 hover:shadow-[0_0_20px_rgba(96,165,250,0.2)]"
          >
            <div className="mb-4 flex h-10 items-end justify-center gap-1 rounded-lg border border-blue-500/20 bg-black/40 p-2 md:h-12 md:gap-2">
              {[40, 60, 45, 75, 50, 65].map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex-1 rounded-sm bg-gradient-to-t from-blue-500 to-cyan-400 opacity-80"
                />
              ))}
            </div>

            <h3 className="mb-2 text-base font-bold text-white md:text-lg">Location & Maps</h3>
            <p className="text-xs leading-relaxed text-zinc-500">
              Venues or virtual links.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}