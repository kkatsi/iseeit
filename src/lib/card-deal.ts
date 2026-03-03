import type { Player } from '../schemas/player';
import { cardIds } from '../constants';

const CARD_BASE_URL = import.meta.env.VITE_CARD_BASE_URL;

export const dealCards = (
  playerIds: Player['id'][],
  cardsPerPlayer: number = 1,
): Map<Player['id'], string[]> => {
  const totalCardsNeeded = playerIds.length * cardsPerPlayer;

  if (totalCardsNeeded > cardIds.length) {
    throw new Error(
      `Not enough cards: need ${totalCardsNeeded} but only ${cardIds.length} available`,
    );
  }

  const shuffled = [...cardIds].sort(() => Math.random() - 0.5);

  const result = new Map<Player['id'], string[]>();

  playerIds.forEach((playerId, index) => {
    const start = index * cardsPerPlayer;
    const playerCardIds = shuffled.slice(start, start + cardsPerPlayer);
    const cardUrls = playerCardIds.map(
      (cardId) => `${CARD_BASE_URL}/cards/${cardId}.png`,
    );
    result.set(playerId, cardUrls);
  });

  return result;
};
