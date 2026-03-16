import {
  ALL_SUBMITTED_PAUSE_MS,
  COLLECT_STAGGER_MS,
  POST_REVEAL_PAUSE_MS,
  REVEAL_STAGGER_MS,
  SHUFFLE_ANIMATION_MS,
} from '@/config/constants';
import { wait } from '@/utils/async';
import { useEffect, useEffectEvent, useMemo, useState } from 'react';

type LocalPhase =
  | 'waiting'
  | 'all-submitted'
  | 'collecting'
  | 'shuffling'
  | 'revealing'
  | 'done';

export const usePlayersSelectCardSequence = (
  players: {
    id: string;
    name: string;
    avatarId: string;
    isStoryteller: boolean;
    hasSubmitted: boolean;
  }[],
  submittedCards: Map<string, string> | undefined,
  onComplete: () => void,
  tableCards: string[] | undefined,
) => {
  const [localPhase, setLocalPhase] = useState<LocalPhase>('waiting');
  const [collectedSet, setCollectedSet] = useState<Set<string>>(new Set());
  const [revealedCount, setRevealedCount] = useState(0);

  const submittedCount = submittedCards?.size ?? 0;
  const totalNonStoryteller = players.length - 1;

  const runAnimation = useEffectEvent(async () => {
    setLocalPhase('all-submitted');
    await wait(ALL_SUBMITTED_PAUSE_MS);

    setLocalPhase('collecting');
    for (const player of players) {
      await wait(COLLECT_STAGGER_MS);
      setCollectedSet((prev) => new Set([...prev, player.id]));
    }
    // Brief settle after last card
    await wait(COLLECT_STAGGER_MS);

    setLocalPhase('shuffling');
    await wait(SHUFFLE_ANIMATION_MS);

    setLocalPhase('revealing');
    for (let i = 0; i < (tableCards?.length ?? 0); i++) {
      await wait(REVEAL_STAGGER_MS);
      setCollectedSet((prev) => {
        const newSet = new Set(prev);
        newSet.delete(players[i].id);
        return newSet;
      });
      setRevealedCount(i + 1);
    }

    setLocalPhase('done');
    await wait(POST_REVEAL_PAUSE_MS);
    onComplete();
  });

  // Trigger animation when tableCards appears (orchestrator computed shuffle)
  useEffect(() => {
    if (tableCards && tableCards.length > 0 && localPhase === 'waiting') {
      runAnimation();
    }
  }, [tableCards, localPhase]);

  const progressText = useMemo(() => {
    switch (localPhase) {
      case 'waiting':
        return `${submittedCount} of ${totalNonStoryteller} players have chosen their card...`;
      case 'all-submitted':
        return 'All players have chosen their card!';
      case 'collecting':
        return 'All players have chosen their card!';
      case 'shuffling':
        return 'Shuffling the cards...';
      case 'revealing':
        return 'Revealing...';
      case 'done':
        return 'Get ready to vote!';
    }
  }, [localPhase, submittedCount, totalNonStoryteller]);

  const showPlayerGrid =
    localPhase === 'waiting' ||
    localPhase === 'all-submitted' ||
    localPhase === 'collecting' ||
    localPhase === 'shuffling';
  const showCardGrid = localPhase === 'revealing' || localPhase === 'done';
  const showStack =
    localPhase === 'collecting' ||
    localPhase === 'shuffling' ||
    localPhase === 'revealing';

  return {
    localPhase,
    collectedSet,
    revealedCount,
    progressText,
    showPlayerGrid,
    showCardGrid,
    showStack,
  };
};
