import { motion } from 'framer-motion';
import type { LobbyPlayer } from '../../../lib/lobby-store';

export const PendingPlayerSlot = ({
  player,
  position,
  slotIndex,
}: {
  player: LobbyPlayer;
  position: { x: number; y: number };
  slotIndex: number;
}) => (
  <div
    className="absolute transition-all duration-1000"
    style={{
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: 'translate(-50%, -50%)',
      animation: `float ${3 + slotIndex * 0.5}s ease-in-out infinite`,
    }}
  >
    <motion.div
      animate={{ opacity: [0.75, 1, 0.75] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      className="relative p-4 min-w-30 text-center"
      style={{
        backgroundColor: 'rgba(222, 200, 165, 0.6)',
        borderRadius: '12px 8px 14px 6px',
        border: '2px dashed rgba(180, 155, 120, 0.4)',
        boxShadow: '2px 3px 8px rgba(45, 42, 38, 0.12)',
        transform: `rotate(${(slotIndex % 2 === 0 ? -1 : 1) * (1 + slotIndex * 0.3)}deg)`,
      }}
    >
      <img
        src={`/avatars/${player.avatarId}.png`}
        alt="Approaching adventurer"
        className="mx-auto mb-2 object-cover w-28 h-28 rounded-full grayscale opacity-50"
        style={{
          border: '3px solid rgba(180, 155, 120, 0.3)',
        }}
      />

      <p
        className="font-handwritten text-sm italic"
        style={{ color: 'rgba(107, 101, 96, 0.7)' }}
      >
        An adventurer
        <br />
        approaches...
      </p>
    </motion.div>
  </div>
);
