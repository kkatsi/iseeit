import { LOCAL_STORAGE_STATE_KEY } from '@/config/constants';
import { getFromLocalStorage } from '@/lib/local-storage';
import { useLobbyStore } from '@/stores/lobby-store';
import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

export const WaitingScreen = ({ children }: PropsWithChildren) => {
  const players = useLobbyStore((state) => state.players);
  const playerId = getFromLocalStorage(LOCAL_STORAGE_STATE_KEY)?.playerId;
  const player = playerId ? players.get(playerId) : undefined;

  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center gap-4">
      {player?.avatarId && (
        <img
          src={`/avatars/${player.avatarId}.png`}
          alt="Your avatar"
          className="w-36 h-36 rounded-full object-cover"
          style={{
            border: '3px solid rgba(180, 155, 120, 0.6)',
            boxShadow: 'inset 0 0 8px rgba(120, 90, 50, 0.15)',
          }}
        />
      )}

      {player?.name && (
        <p
          className="font-handwritten text-3xl"
          style={{ color: 'rgba(92, 74, 61, 1)' }}
        >
          {player.name}
        </p>
      )}

      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="font-serif text-xl"
        style={{ color: 'rgba(92, 74, 61, 0.7)' }}
      >
        {children}
      </motion.p>
    </div>
  );
};
