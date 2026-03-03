import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Player } from '../schemas/player';
import { SCORE_THRESHOLD } from '../constants';

export type PlayerData = {
  score: number;
  name: string;
  isReady: boolean;
  isConnected: boolean;
};

export type PlayersDataMap = Map<Player['id'], PlayerData>;

export type GamePhase =
  | 'CARD_DEAL'
  | 'STORYTELLER_CLUE'
  | 'PLAYERS_SELECT_CARD'
  | 'VOTING'
  | 'ROUND_RESULTS'
  | 'GAME_END';

type RoundState = {
  storytellerId: string;
  clue?: string;
  storytellerCard?: string;
  submittedCards?: Map<string, string>; // playerId → cardURL
  tableCards?: string[]; // shuffled submitted cards (for voting display)
  votes?: Map<string, string>; // voterId → cardURL voted for
  roundScores?: Map<string, number>; // points earned THIS round
};

type GameStore = {
  playersData: PlayersDataMap;
  round: RoundState;
  phase?: GamePhase;
  order: string[]; //playerId in order;
  scoreThreshhold: number;
  cards?: string[];
  setPhase: (phase: GamePhase) => void;
  setRound: (round: RoundState) => void;
  setOrder: (order: string[]) => void;
  setCards: (cards: string[]) => void;
  setPlayersData: (playersData: PlayersDataMap) => void;
  setPlayerReady: (playerId: Player['id'], isReady: boolean) => void;
  setPlayerConnected: (playerId: Player['id'], isConnected: boolean) => void;
};

export const useGameStore = create<GameStore>()(
  devtools(
    (set) => ({
      scoreThreshhold: SCORE_THRESHOLD,
      playersData: new Map(),
      setPlayersData: (playersData: PlayersDataMap) =>
        set(() => {
          return { playersData };
        }),
      setRound: (round: RoundState) =>
        set((state) => ({ round: { ...state.round, ...round } })),
      setPhase: (phase: GamePhase) => set(() => ({ phase })),
      setCards: (cards: string[]) => set(() => ({ cards })),
      setOrder: (order: string[]) => set(() => ({ order })),
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
