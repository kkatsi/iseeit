import { useEffect } from 'react';
import { useGameStore } from '../../lib/game-store';
import { usePeerStore } from '../../lib/peer-store';
import { getFromLocalStorage } from '../../lib/local-storage';
import { LOCAL_STORAGE_STATE_KEY } from '../../constants';
import type { PlayerReadyEvent } from '../../schemas/events';

const DealPhase = () => {
  const { playerId } = getFromLocalStorage(LOCAL_STORAGE_STATE_KEY);

  const connection = usePeerStore((state) => state.connections.get(playerId));
  const cards = useGameStore((state) => state.cards);

  useEffect(() => {
    const timeout = setTimeout(() => {
      connection?.send({
        type: 'PLAYER_READY',
        playerId,
      } satisfies PlayerReadyEvent);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!cards) return 'waiting for cards...';

  return cards.map((card) => (
    <img
      key={card}
      src={card}
      width={100}
      height={100}
    />
  ));
};

export default DealPhase;
