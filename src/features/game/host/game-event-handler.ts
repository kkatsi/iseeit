import { useGameStore } from '@/stores/game-store';
import { calculateScores } from '@/utils/game-logic';
import { syncGameState } from '@/utils/game-logic';
import { shuffleItems } from '@/utils/shuffle';
import type { GameEvent } from '@/schemas/events';

export const handleGameEvent = (event: GameEvent): void => {
  switch (event.type) {
    case 'STORYTELLER_CLUE': {
      const currentPlayersData = useGameStore.getState().playersData;
      useGameStore.getState().setRound({
        clue: event.clue,
        storytellerCard: event.card,
      });
      useGameStore.getState().setPhase('PLAYERS_SELECT_CARD');
      for (const [playerId] of currentPlayersData) {
        syncGameState(playerId);
      }
      break;
    }
    case 'PLAYER_SELECTS_CARD': {
      const currentPlayersData = useGameStore.getState().playersData;
      const storytellerCard = useGameStore.getState().round.storytellerCard;
      const submittedCards = new Map(useGameStore.getState().round.submittedCards);
      submittedCards?.set(event.playerId, event.card);
      useGameStore.getState().setRound({ submittedCards });

      if (submittedCards?.size === currentPlayersData.size - 1 && storytellerCard) {
        const shuffledCards = shuffleItems([...submittedCards.values(), storytellerCard]);
        useGameStore.getState().setRound({ tableCards: shuffledCards });
      }
      break;
    }
    case 'VOTING': {
      const currentPlayersData = useGameStore.getState().playersData;
      const votes = new Map(useGameStore.getState().round.votes);
      const { storytellerCard, storytellerId, submittedCards } =
        useGameStore.getState().round;

      votes.set(event.playerId, event.card);
      useGameStore.getState().setRound({ votes });

      if (
        votes?.size === currentPlayersData.size - 1 &&
        storytellerCard &&
        submittedCards
      ) {
        useGameStore.getState().setRound({
          roundScores: calculateScores({
            storytellerCard,
            storytellerId,
            submittedCards,
            votes,
          }),
        });
      }
      break;
    }
    default:
      break;
  }
};
