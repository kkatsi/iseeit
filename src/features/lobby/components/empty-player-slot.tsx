import { motion } from 'framer-motion';
import { avatarIds } from '@/config/constants';

export const EmptyPlayerSlot = ({
  position,
  slotIndex,
}: {
  slotIndex: number;
  position: { x: number; y: number };
}) => (
  <div
    key={`empty-${slotIndex}`}
    className="absolute"
    style={{
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: 'translate(-50%, -50%)',
    }}
  >
    <motion.div
      animate={{ opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-20 text-center"
    >
      <img
        src={`/avatars/${avatarIds[slotIndex]}.png`}
        alt=""
        className="w-16 h-16 rounded-full mx-auto object-cover grayscale"
      />
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-handwritten text-[28px]"
        style={{ color: 'rgba(107, 101, 96, 0.6)' }}
      >
        ?
      </span>
    </motion.div>
  </div>
);
