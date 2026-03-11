import { motion } from 'framer-motion';

export const StartGameButton = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    className="cursor-pointer rounded-full px-16 py-6 text-[28px] font-handwritten bg-primary text-card border-2 border-[rgba(250,247,240,0.2)]"
    onClick={onClick}
    animate={{
      scale: [1, 1.03, 1],
      boxShadow: [
        '0 4px 12px rgba(61, 90, 71, 0.3)',
        '0 6px 20px rgba(61, 90, 71, 0.5)',
        '0 4px 12px rgba(61, 90, 71, 0.3)',
      ],
    }}
    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
  >
    Begin the Journey
  </motion.button>
);
