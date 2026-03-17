import type { PlayerScore } from '../types';
import { AnimatePresence, motion } from 'framer-motion';

export const PlayerResultRow = ({
  index,
  showPoints,
  showTotal,
  isTopThree,
  player,
}: {
  isTopThree: boolean;
  index: number;
  player: PlayerScore;
  showPoints: boolean;
  showTotal: boolean;
}) => {
  return (
    <motion.div
      key={player.id}
      layoutId={player.id}
      layout
      className="flex items-center gap-4 w-full rounded-2xl"
      style={{
        padding: isTopThree ? '12px 20px' : '8px 14px',
        backgroundColor: isTopThree
          ? index === 0
            ? 'rgba(255, 230, 150, 0.95)'
            : index === 1
              ? 'rgba(235, 235, 235, 0.95)'
              : 'rgba(235, 210, 180, 0.95)'
          : 'rgba(222, 200, 165, 0.85)',
        border: isTopThree
          ? `3px solid ${index === 0 ? '#d4af37' : index === 1 ? '#c0c0c0' : '#cd7f32'}`
          : '2px solid rgba(180, 155, 120, 0.4)',
        boxShadow: isTopThree
          ? '0 8px 20px rgba(120, 90, 50, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
          : '3px 4px 10px rgba(45, 42, 38, 0.15), inset 0 1px 0 rgba(255, 245, 225, 0.4)',
      }}
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 22,
        delay: index * 0.1,
        layout: { type: 'spring', stiffness: 120, damping: 20 },
      }}
    >
      <span
        className="font-handwritten shrink-0"
        style={{
          fontSize: isTopThree ? '2rem' : '1.5rem',
          color: isTopThree ? 'rgba(60, 45, 20, 0.9)' : 'rgba(92, 74, 61, 0.6)',
          width: isTopThree ? '48px' : '32px',
          textAlign: 'center',
        }}
      >
        {index + 1}
      </span>

      <div
        className="shrink-0 rounded-full overflow-hidden"
        style={{
          width: isTopThree ? '64px' : '42px',
          height: isTopThree ? '64px' : '42px',
          border: `2px solid ${isTopThree ? 'rgba(255,255,255,0.6)' : 'rgba(180, 155, 120, 0.5)'}`,
          boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.15)',
        }}
      >
        <img
          src={`/avatars/${player.avatarId}.png`}
          alt={player.name}
          className="w-full h-full object-cover"
        />
      </div>

      <span
        className="font-serif flex-1 truncate"
        style={{
          fontSize: isTopThree ? '1.5rem' : '1.15rem',
          fontWeight: isTopThree ? 700 : 400,
          color: 'rgba(70, 55, 45, 1)',
        }}
      >
        {player.name}
      </span>

      <div
        className="flex items-center gap-4 shrink-0"
        style={{
          minWidth: isTopThree ? '180px' : '120px',
          justifyContent: 'flex-end',
        }}
      >
        <AnimatePresence>
          {showPoints && player.roundPoints > 0 && !showTotal && (
            <motion.span
              initial={{ opacity: 0, scale: 0, y: 10 }}
              animate={{ opacity: 1, scale: 1.3, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="font-handwritten text-emerald-800 font-bold"
              style={{ fontSize: isTopThree ? '1.3rem' : '1.1rem' }}
            >
              +{player.roundPoints}
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!showTotal ? (
            <motion.span
              key="prev"
              className="font-handwritten"
              style={{
                fontSize: isTopThree ? '2.2rem' : '1.8rem',
                color: 'rgba(92, 74, 61, 0.85)',
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              {player.previousScore}
            </motion.span>
          ) : (
            <motion.span
              key="total"
              className="font-handwritten"
              style={{
                fontSize: isTopThree ? '2.2rem' : '1.8rem',
                color: 'rgba(70, 55, 45, 1)',
              }}
              initial={{ opacity: 0, scale: 1.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
              }}
            >
              {player.totalScore}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
