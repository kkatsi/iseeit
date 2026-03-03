import { useGameStore } from '../lib/game-store';
import { usePeerStore } from '../lib/peer-store';
import type { GameStateSyncEvent } from '../schemas/events';

const useSyncGameState = () => {
  const syncGameState = (playerId: string) => {
    const connection = usePeerStore.getState().connections.get(playerId);
    const storytellerId = useGameStore.getState().round.storytellerId;
    const cards = useGameStore.getState().cards?.get(playerId) || [];
    const phase = useGameStore.getState().phase;

    if (!connection) throw new Error('no connection');

    connection.send({
      type: 'GAME_STATE_SYNC',
      phase: phase || 'GAME_END',
      cards,
      storytellerId,
      playerId,
    } satisfies GameStateSyncEvent);
  };

  return syncGameState;
};

export default useSyncGameState;
