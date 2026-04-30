import type { Transition } from 'framer-motion';

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', damping: 25, stiffness: 500 }
};

export const springTransition: Transition = {
  type: 'spring',
  damping: 25,
  stiffness: 500
};
