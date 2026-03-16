import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SCORE_THRESHOLD } from '@/config/constants';

export type PlayerData = {
  score: number;
  name: string;
  avatarId: string;
  isConnected: boolean;
};

export type PlayersDataMap = Map<string, PlayerData>;

export type GamePhase =
  | 'CARD_DEAL'
  | 'STORYTELLER_CLUE'
  | 'PLAYERS_SELECT_CARD'
  | 'VOTING'
  | 'ROUND_RESULTS'
  | 'GAME_END';

type RoundState = {
  number: number;
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
  cards: Map<string, string[]>;
  drawPile: string[];
  discardPile: string[];
  connectedPlayerId: string;
  resetRoundData: () => void;
  setConnectedPlayerId: (playerId: string) => void;
  setPhase: (phase: GamePhase) => void;
  setRound: (round: Partial<RoundState>) => void;
  setOrder: (order: string[]) => void;
  setCards: (cards: Map<string, string[]>) => void;
  setDrawPile: (drawPile: string[]) => void;
  setDiscardPile: (discardPile: string[]) => void;
  setPlayersData: (playersData: PlayersDataMap) => void;
  setPlayerConnected: (playerId: string, isConnected: boolean) => void;
};

export const useGameStore = create<GameStore>()(
  devtools(
    (set) => ({
      scoreThreshhold: SCORE_THRESHOLD,
      connectedPlayerId: '',
      playersData: new Map(),
      resetRoundData: () =>
        set((state) => {
          return {
            round: {
              number: state.round.number,
              storytellerId: state.round.storytellerId,
            },
          };
        }),
      setPlayersData: (playersData: PlayersDataMap) =>
        set(() => {
          return { playersData };
        }),
      setRound: (round: Partial<RoundState>) =>
        set((state) => ({ round: { ...state.round, ...round } })),
      setPhase: (phase: GamePhase) => set(() => ({ phase })),
      drawPile: [],
      discardPile: [],
      setCards: (cards: Map<string, string[]>) => set(() => ({ cards })),
      setDrawPile: (drawPile: string[]) => set(() => ({ drawPile })),
      setDiscardPile: (discardPile: string[]) => set(() => ({ discardPile })),
      setOrder: (order: string[]) => set(() => ({ order })),
      setConnectedPlayerId: (playerId: string) =>
        set(() => ({
          connectedPlayerId: playerId,
        })),
      setPlayerConnected: (playerId: string, isConnected: boolean) =>
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
