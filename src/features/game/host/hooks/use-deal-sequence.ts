import { calculateDealDuration, getHostDealStagger } from '@/lib/card-deal';
import type { PlayersDataMap } from '@/stores/game-store';
import { useMemo } from 'react';

export const useDealSequence = (
  players: PlayersDataMap,
  roundNumber: number,
) => {
  const cardsPerPlayer = roundNumber === 1 ? 6 : 1;

  const dealStagger = getHostDealStagger(players.size);

  const dealDurationMs =
    calculateDealDuration(players.size, cardsPerPlayer) * 1000;

  // Build a flat list of deal actions: round-robin like a real dealer
  // for each card round
  const dealSequence = useMemo(() => {
    const playerIds = [...players.keys()];
    const sequence: { id: string; playerIndex: number; dealIndex: number }[] =
      [];
    for (let card = 0; card < cardsPerPlayer; card++) {
      for (let p = 0; p < playerIds.length; p++) {
        sequence.push({
          id: playerIds[p],
          playerIndex: p,
          dealIndex: sequence.length,
        });
      }
    }
    return sequence;
  }, [players, cardsPerPlayer]);

  return {
    dealDurationMs,
    dealStagger,
    dealSequence,
  };
};
