import { create } from 'zustand';
import type { Player } from './types';

type Store = {
  players: Map<string, Player>;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: Player['id']) => void;
  addPointsToPlayer: (playerId: Player['id'], points: Player['points']) => void;
};

export const useStore = create<Store>()((set) => ({
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
  addPointsToPlayer: (id: Player['id'], newPoints: Player['points']) =>
    set((state) => {
      const newPlayers = new Map(state.players);
      const currentPlayer = newPlayers.get(id);

      if (!currentPlayer) return state;

      newPlayers.set(id, {
        ...currentPlayer,
        points: currentPlayer?.points + newPoints,
      });

      return { players: newPlayers };
    }),
}));
