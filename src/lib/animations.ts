export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', damping: 25, stiffness: 500 }
};

export const springTransition = {
  type: 'spring',
  damping: 25,
  stiffness: 500
};
