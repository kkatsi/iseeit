import type { DataConnection } from 'peerjs';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type PeerStore = {
  connections: Map<string, DataConnection>;
  addConnection: (playerId: string, conn: DataConnection) => void;
  removeConnection: (playerId: string) => void;
};

export const usePeerStore = create<PeerStore>()(
  devtools(
    (set) => ({
      connections: new Map(),
      addConnection: (playerId: string, conn: DataConnection) =>
        set((state) => {
          const newConnections = new Map(state.connections);
          newConnections.set(playerId, conn);
          return { connections: newConnections };
        }),
      removeConnection: (playerId: string) =>
        set((state) => {
          const newConnections = new Map(state.connections);
          newConnections.delete(playerId);
          return { connections: newConnections };
        }),
    }),
    { name: 'PeerStore' },
  ),
);
