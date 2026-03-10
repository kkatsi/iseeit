import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { avatarIds } from '../constants';

interface BaseLobbyPlayer {
  id: string;
  connectionId: string;
  avatarId: string;
}

interface PendingLobbyPlayer extends BaseLobbyPlayer {
  status: 'pending';
  name?: string;
}

interface ReadyLobbyPlayer extends BaseLobbyPlayer {
  status: 'ready';
  name: string;
}

export type LobbyPlayer = PendingLobbyPlayer | ReadyLobbyPlayer;

const deriveUnavailableAvatars = (players: Map<string, LobbyPlayer>) =>
  [...players.values()].map((p) => p.avatarId);

type LobbyStore = {
  players: Map<string, LobbyPlayer>;
  unavailableAvatarIds: string[];
  addPendingPlayer: (playerId: string, connectionId: string) => void;
  setPlayersAvatar: (playerId: string, avatarId: string) => void;
  finalizePlayer: (playerId: string, name: string, avatarId: string) => void;
  removePlayer: (playerId: string) => void;
  setPlayers: (players: Map<string, LobbyPlayer>) => void;
};

export const useLobbyStore = create<LobbyStore>()(
  devtools(
    (set) => ({
      players: new Map([]),
      unavailableAvatarIds: [],

      addPendingPlayer: (playerId: string, connectionId: string) =>
        set((state) => {
          const takenAvatars = new Set(
            [...state.players.values()].map((p) => p.avatarId),
          );
          const availableAvatars = avatarIds.filter(
            (id) => !takenAvatars.has(id),
          );
          const avatarId =
            availableAvatars[Math.floor(Math.random() * availableAvatars.length)];

          if (!avatarId) return state;

          const newPlayers = new Map(state.players);
          newPlayers.set(playerId, {
            id: playerId,
            connectionId,
            avatarId,
            status: 'pending',
          });
          return {
            players: newPlayers,
            unavailableAvatarIds: deriveUnavailableAvatars(newPlayers),
          };
        }),

      setPlayersAvatar: (playerId: string, avatarId: string) =>
        set((state) => {
          const player = state.players.get(playerId);
          if (!player) return state;

          const takenByOther = [...state.players.entries()].some(
            ([id, p]) => id !== playerId && p.avatarId === avatarId,
          );
          if (takenByOther) return state;

          const newPlayers = new Map(state.players);
          newPlayers.set(playerId, {
            ...player,
            avatarId,
          } as PendingLobbyPlayer);
          return {
            players: newPlayers,
            unavailableAvatarIds: deriveUnavailableAvatars(newPlayers),
          };
        }),

      finalizePlayer: (playerId: string, name: string) =>
        set((state) => {
          const player = state.players.get(playerId);
          const newPlayers = new Map(state.players);
          newPlayers.set(playerId, {
            ...player,
            name,
            status: 'ready',
          } as ReadyLobbyPlayer);
          return {
            players: newPlayers,
          };
        }),

      removePlayer: (id: string) =>
        set((state) => {
          const newPlayers = new Map(state.players);
          newPlayers.delete(id);
          return {
            players: newPlayers,
            unavailableAvatarIds: deriveUnavailableAvatars(newPlayers),
          };
        }),

      setPlayers: (players: Map<string, LobbyPlayer>) =>
        set(() => ({
          players,
          unavailableAvatarIds: deriveUnavailableAvatars(players),
        })),
    }),
    { name: 'LobbyStore' },
  ),
);
