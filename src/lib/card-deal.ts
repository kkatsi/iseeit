import { cardIds } from '@/config/constants';
import { shuffleItems } from '@/utils/shuffle';

const CARD_BASE_URL = import.meta.env.VITE_CARD_BASE_URL;

const toCardUrl = (cardId: string) => `${CARD_BASE_URL}/cards/${cardId}.png`;

/**
 * Creates a shuffled draw pile from all card IDs (as URLs).
 */
export const createDeck = (): string[] =>
  shuffleItems(cardIds.map(toCardUrl));

/**
 * Draws `count` cards from the draw pile.
 * If draw pile runs out, reshuffles discard pile into it.
 * Returns the drawn cards and updated piles.
 */
export const drawCards = (
  count: number,
  drawPile: string[],
  discardPile: string[],
): { drawn: string[]; drawPile: string[]; discardPile: string[] } => {
  let currentDraw = [...drawPile];
  let currentDiscard = [...discardPile];
  const drawn: string[] = [];

  for (let i = 0; i < count; i++) {
    if (currentDraw.length === 0) {
      if (currentDiscard.length === 0) break; // no cards left anywhere
      currentDraw = shuffleItems(currentDiscard);
      currentDiscard = [];
    }
    drawn.push(currentDraw.pop()!);
  }

  return { drawn, drawPile: currentDraw, discardPile: currentDiscard };
};

/**
 * Deals `cardsPerPlayer` cards to each player from the draw pile.
 * Returns player hands and updated piles.
 */
export const dealToPlayers = (
  playerIds: string[],
  cardsPerPlayer: number,
  drawPile: string[],
  discardPile: string[] = [],
): {
  hands: Map<string, string[]>;
  drawPile: string[];
  discardPile: string[];
} => {
  let currentDraw = drawPile;
  let currentDiscard = discardPile;
  const hands = new Map<string, string[]>();

  for (const playerId of playerIds) {
    const result = drawCards(cardsPerPlayer, currentDraw, currentDiscard);
    hands.set(playerId, result.drawn);
    currentDraw = result.drawPile;
    currentDiscard = result.discardPile;
  }

  return { hands, drawPile: currentDraw, discardPile: currentDiscard };
};
