import { useEffect } from 'react';
import { useGameStore } from '@/stores/game-store';
import { usePeerStore } from '@/stores/peer-store';
import type { PlayerReadyEvent } from '@/schemas/events';

const DealPhase = () => {
  const playerId = useGameStore((state) => state.connectedPlayerId);
  const connection = usePeerStore((state) => state.connections.get(playerId));
  const cards = useGameStore((state) => state.cards).get(playerId);

  useEffect(() => {
    console.log({ playerId, connection });

    if (!playerId || !connection) return;

    const timeout = setTimeout(() => {
      connection?.send({
        type: 'PLAYER_READY',
        playerId,
      } satisfies PlayerReadyEvent);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [playerId, connection]);

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
