import { motion } from 'framer-motion';

export const ShufflingCardStack = ({
  isSuffling,
  totalCards,
}: {
  totalCards: number;
  isSuffling: boolean;
}) => {
  return (
    <motion.div
      className="relative"
      style={{ width: '128px', height: '192px' }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5 }}
    >
      {Array.from({ length: totalCards }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-xl overflow-hidden"
          style={{
            border: '1px solid rgba(0, 0, 0, 0.15)',
            zIndex: i,
          }}
          animate={
            isSuffling
              ? {
                  x: [
                    0,
                    (i % 2 === 0 ? 1 : -1) * 20,
                    0,
                    (i % 2 === 0 ? -1 : 1) * 15,
                    0,
                  ],
                  rotate: [
                    0,
                    (i % 2 === 0 ? 1 : -1) * 8,
                    0,
                    (i % 2 === 0 ? -1 : 1) * 6,
                    0,
                  ],
                  y: [0, -5, 3, -2, 0],
                }
              : {
                  x: -i * 2,
                  y: i * 2,
                  rotate: 0,
                }
          }
          transition={
            isSuffling
              ? {
                  duration: 0.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.08,
                }
              : { duration: 0.4 }
          }
        >
          <img
            src="/cards/card-back.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
      ))}

      {/* Glow effect during shuffle */}
      {isSuffling && (
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 rounded-xl blur-xl"
          style={{
            backgroundColor: 'rgba(212, 162, 106, 0.3)',
            zIndex: -1,
          }}
        />
      )}
    </motion.div>
  );
};
