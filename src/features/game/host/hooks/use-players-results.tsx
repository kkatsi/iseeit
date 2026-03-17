import { useGameStore } from '@/stores/game-store';
import type { PlayerScore } from '@/types';
import { useMemo } from 'react';

export const usePlayersResults = () => {
  const playersData = useGameStore((state) => state.playersData);
  const roundScores = useGameStore((state) => state.round.roundScores);

  const players = useMemo(() => {
    const result: PlayerScore[] = [];
    for (const [id, data] of playersData) {
      const roundPoints = roundScores?.get(id) ?? 0;
      result.push({
        id,
        name: data.name,
        avatarId: data.avatarId,
        previousScore: data.score - roundPoints,
        roundPoints,
        totalScore: data.score,
      });
    }
    return result.sort((a, b) => b.totalScore - a.totalScore);
  }, [playersData, roundScores]);

  const { topThree, others } = useMemo(() => {
    return {
      topThree: players.slice(0, 3),
      others: players.slice(3),
    };
  }, [players]);

  return { players, topThree, others };
};
