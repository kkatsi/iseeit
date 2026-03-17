import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

export const ProgressText = ({ children }: PropsWithChildren) => {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      className="font-serif text-xl"
      style={{ color: 'rgba(92, 74, 61, 0.7)' }}
    >
      {children}
    </motion.p>
  );
};
