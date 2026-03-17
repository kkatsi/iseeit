import { describe, it, expect, beforeEach, vi } from 'vitest';

beforeEach(() => {
  vi.stubEnv('VITE_CARD_BASE_URL', 'https://example.com');
});

const { drawCards, dealToPlayers } = await import('../card-deal');

describe('drawCards', () => {
  it('draws the requested number of cards from the draw pile', () => {
    const pile = ['a', 'b', 'c', 'd', 'e'];
    const { drawn, drawPile } = drawCards(3, pile, []);
    expect(drawn).toHaveLength(3);
    expect(drawPile).toHaveLength(2);
  });

  it('does not modify the original array', () => {
    const pile = ['a', 'b', 'c'];
    drawCards(2, pile, []);
    expect(pile).toEqual(['a', 'b', 'c']);
  });

  it('reshuffles discard pile when draw pile is exhausted', () => {
    const { drawn, drawPile, discardPile } = drawCards(4, ['a', 'b'], ['c', 'd', 'e']);
    expect(drawn).toHaveLength(4);
    // 5 total cards, drew 4 → 1 remaining between draw and discard
    expect(drawPile.length + discardPile.length).toBe(1);
  });

  it('returns fewer cards when both piles are exhausted', () => {
    const { drawn } = drawCards(5, ['a', 'b'], []);
    expect(drawn).toHaveLength(2);
  });

  it('returns empty when both piles start empty', () => {
    const { drawn } = drawCards(3, [], []);
    expect(drawn).toHaveLength(0);
  });
});

describe('dealToPlayers', () => {
  it('deals the correct number of cards to each player', () => {
    const playerIds = ['p1', 'p2', 'p3'];
    const pile = Array.from({ length: 18 }, (_, i) => `card-${i}`);
    const { hands } = dealToPlayers(playerIds, 6, pile);
    expect(hands.get('p1')).toHaveLength(6);
    expect(hands.get('p2')).toHaveLength(6);
    expect(hands.get('p3')).toHaveLength(6);
  });

  it('each player receives unique cards', () => {
    const playerIds = ['p1', 'p2'];
    const pile = Array.from({ length: 12 }, (_, i) => `card-${i}`);
    const { hands } = dealToPlayers(playerIds, 6, pile);
    const p1Cards = hands.get('p1')!;
    const p2Cards = hands.get('p2')!;
    const overlap = p1Cards.filter((c) => p2Cards.includes(c));
    expect(overlap).toHaveLength(0);
  });

  it('reshuffles discard pile when draw pile runs low', () => {
    const playerIds = ['p1', 'p2'];
    const drawPile = ['card-1', 'card-2', 'card-3'];
    const discardPile = Array.from({ length: 10 }, (_, i) => `discard-${i}`);
    const { hands } = dealToPlayers(playerIds, 6, drawPile, discardPile);
    expect(hands.get('p1')).toHaveLength(6);
    expect(hands.get('p2')).toHaveLength(6);
  });
});
