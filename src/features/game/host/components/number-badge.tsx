import { motion } from 'framer-motion';

export const NumberBadge = ({ number }: { number: number }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: number * 0.08,
      }}
      className="flex items-center justify-center font-handwritten text-lg"
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: 'rgba(222, 200, 165, 0.9)',
        border: '1.5px solid rgba(180, 155, 120, 0.5)',
        color: 'rgba(92, 74, 61, 0.9)',
        marginTop: '6px',
      }}
    >
      {number + 1}
    </motion.div>
  );
};
