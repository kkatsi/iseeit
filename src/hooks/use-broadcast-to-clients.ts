import { usePeerStore } from '@/stores/peer-store';
import type { GameEvent } from '@/schemas/events';
import { sendEvent } from '@/lib/peer';

const useBroadcastToClients = () => {
  const connections = usePeerStore((state) => state.connections);
  const broadcast = (data: GameEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_playerId, connection] of connections) {
      sendEvent(connection, data);
    }
  };

  return broadcast;
};

export default useBroadcastToClients;
