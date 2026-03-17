import { RESULTS_PHASE_DURATION_MS } from '@/config/constants';
import { useEffect, useEffectEvent, useState } from 'react';

export const useResultsPageTimers = (advanceToNextRound: () => void) => {
  const [showPoints, setShowPoints] = useState(false);
  const [showTotal, setShowTotal] = useState(false);

  const toNextRound = useEffectEvent(advanceToNextRound);

  useEffect(() => {
    const pointsTimer = setTimeout(() => setShowPoints(true), 1000);
    const totalTimer = setTimeout(() => setShowTotal(true), 2800);
    const nextRoundTimer = setTimeout(() => {
      toNextRound();
    }, RESULTS_PHASE_DURATION_MS);

    return () => {
      clearTimeout(pointsTimer);
      clearTimeout(totalTimer);
      clearTimeout(nextRoundTimer);
    };
  }, []);

  return { showPoints, showTotal };
};
