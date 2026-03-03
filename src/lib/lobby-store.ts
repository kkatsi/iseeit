import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Player } from '../schemas/player';

type LobbyStore = {
  players: Map<Player['id'], Player>;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: Player['id']) => void;
};

export const useLobbyStore = create<LobbyStore>()(
  devtools(
    (set) => ({
      players: new Map([]),
      addPlayer: (player: Player) =>
        set((state) => {
          const existingPlayer = state.players.get(player.id);
          if (existingPlayer) return state;

          const newPlayers = new Map(state.players);
          newPlayers.set(player.id, player);
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
