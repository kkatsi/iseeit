import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Player } from '../schemas/player';
import type { PlayersData } from '../schemas/events';

export type PlayersDataMap = Map<Player['id'], PlayersData>;

type GameStore = {
  playersData: PlayersDataMap;
  round?: number;
  phase?:
    | 'CARD_DEAL'
    | 'WORD_ANNOUNCEMENT'
    | 'PLAYERS_SELECT_CARD'
    | 'CARD_REVEAL'
    | 'GAME_END';
  setGameData: (gameData: {
    playersData: PlayersDataMap;
    round?: number;
    phase?:
      | 'CARD_DEAL'
      | 'WORD_ANNOUNCEMENT'
      | 'PLAYERS_SELECT_CARD'
      | 'CARD_REVEAL'
      | 'GAME_END';
  }) => void;
  setPlayerReady: (playerId: Player['id'], isReady: boolean) => void;
  setPlayerConnected: (playerId: Player['id'], isConnected: boolean) => void;
};

export const useGameStore = create<GameStore>()(
  devtools(
    (set) => ({
      playersData: new Map(),
      setGameData: (gameData) => set(() => gameData),
      setPlayerReady: (playerId: Player['id'], isReady: boolean) =>
        set((state) => {
          const newPlayersData = new Map(state.playersData);
          const currentPlayerData = newPlayersData.get(playerId);

          if (!currentPlayerData) return {};

          newPlayersData.set(playerId, { ...currentPlayerData, isReady });

          return { playersData: newPlayersData };
        }),
      setPlayerConnected: (playerId: Player['id'], isConnected: boolean) =>
        set((state) => {
          const newPlayersData = new Map(state.playersData);
          const currentPlayerData = newPlayersData.get(playerId);

          if (!currentPlayerData) return {};

          newPlayersData.set(playerId, { ...currentPlayerData, isConnected });

          return { playersData: newPlayersData };
        }),
    }),
    { name: 'GameStore' },
  ),
);
