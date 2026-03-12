import { useGameStore, type PlayersDataMap } from '@/stores/game-store';
import { usePeerStore } from '@/stores/peer-store';
import type { GameStateSyncEvent } from '@/schemas/events';
import { shuffleItems } from './shuffle';

export const calculatePlayingOrder = (playersData: PlayersDataMap) => {
  const playerIds = [...playersData.keys()];
  return shuffleItems(playerIds);
};

export const getStoryteller = (order: string[], roundNumber: number) =>
  order[(roundNumber - 1) % order.length];

export const calculateScores = ({
  submittedCards,
  votes,
  storytellerId,
  storytellerCard,
}: {
  submittedCards: Map<string, string>;
  votes: Map<string, string>;
  storytellerId: string;
  storytellerCard: string;
}): Map<string, number> => {
  const scores = new Map<string, number>();

  scores.set(storytellerId, 0);
  for (const [playerId] of submittedCards) {
    scores.set(playerId, 0);
  }

  const votesForStoryteller = [...votes.values()].filter(
    (card) => card === storytellerCard,
  ).length;

  const totalVoters = votes.size;
  const allFoundIt = votesForStoryteller === totalVoters;
  const nobodyFoundIt = votesForStoryteller === 0;

  if (allFoundIt || nobodyFoundIt) {
    for (const [playerId] of submittedCards) {
      scores.set(playerId, 2);
    }
  } else {
    scores.set(storytellerId, 3);
    for (const [voterId, card] of votes) {
      if (card === storytellerCard) {
        scores.set(voterId, (scores.get(voterId) || 0) + 3);
      }
    }
  }

  for (const [playerId, submittedCard] of submittedCards) {
    const votesReceived = [...votes.values()].filter(
      (card) => card === submittedCard,
    ).length;
    scores.set(playerId, (scores.get(playerId) || 0) + votesReceived);
  }

  return scores;
};

export const syncGameState = (playerId: string) => {
  const connection = usePeerStore.getState().connections.get(playerId);
  const { storytellerId, clue, tableCards, roundScores } =
    useGameStore.getState().round;
  const cards = useGameStore.getState().cards?.get(playerId) || [];
  const phase = useGameStore.getState().phase;

  if (!connection) throw new Error('no connection');

  connection.send({
    type: 'GAME_STATE_SYNC',
    phase: phase || 'GAME_END',
    cards,
    storytellerId,
    ...(clue ? { clue } : {}),
    ...(tableCards ? { tableCards } : {}),
    roundScore: roundScores?.get(playerId) ?? 0,
    playerId,
  } satisfies GameStateSyncEvent);
};
