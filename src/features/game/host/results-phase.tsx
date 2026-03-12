import { useEffect, useEffectEvent } from 'react';
import useGameOrcestrator from '@/hooks/use-game-orchestrator';
import { useGameStore } from '@/stores/game-store';

const ResultsPhase = () => {
  const playersData = useGameStore.getState().playersData;
  const { roundScores } = useGameStore.getState().round;
  const { advanceToNextRound } = useGameOrcestrator();

  const toNextRound = useEffectEvent(advanceToNextRound);

  useEffect(() => {
    const t = setTimeout(() => {
      toNextRound();
    }, 10000);

    return () => {
      clearTimeout(t);
    };
  }, []);
  return (
    <div>
      {[...playersData.entries()].map(([playerId, playerData]) => (
        <div key={playerId}>
          <span>{playerData.name}</span>
          <br />
          <span>prevous score: {playerData.score}</span>
          <span>round's score: {roundScores?.get(playerId)}</span>
        </div>
      ))}
    </div>
  );
};

export default ResultsPhase;
