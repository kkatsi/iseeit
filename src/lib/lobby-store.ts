import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Player } from '../schemas/player';
import { avatarIds, SLOT_POSITIONS } from '../constants';

export type LobbyPlayer = Player & {
  slotIndex: number;
  connectionId: string;
  avatarId: string;
};

type LobbyStore = {
  players: Map<Player['id'], LobbyPlayer>;
  addPlayer: (player: Player, connectionId: string) => void;
  removePlayer: (playerId: Player['id']) => void;
};

export const useLobbyStore = create<LobbyStore>()(
  devtools(
    (set) => ({
      players: new Map([]),
      addPlayer: (player: Player, connectionId: string) =>
        set((state) => {
          const existingPlayer = state.players.get(player.id);
          if (existingPlayer) return state;

          const usedSlots = new Set(
            [...state.players.values()].map((p) => p.slotIndex),
          );
          const available = SLOT_POSITIONS.map((_, i) => i).filter(
            (i) => !usedSlots.has(i),
          );

          if (available.length === 0) return state;

          const slotIndex =
            available[Math.floor(Math.random() * available.length)];

          const avatarId = avatarIds[slotIndex];

          const newPlayers = new Map(state.players);
          newPlayers.set(player.id, {
            ...player,
            slotIndex,
            connectionId,
            avatarId,
          });
          return { players: newPlayers };
        }),
      removePlayer: (id: Player['id']) =>
        set((state) => {
          const newPlayers = new Map(state.players);
          newPlayers.delete(id);
          return { players: newPlayers };
        }),
    }),
    { name: 'LobbyStore' },
  ),
);
