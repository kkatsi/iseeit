import { describe, it, expect } from 'vitest';
import { calculateScores, getStoryteller, calculatePlayingOrder } from '../game-logic';

describe('getStoryteller', () => {
  it('returns the first player for round 1', () => {
    expect(getStoryteller(['a', 'b', 'c'], 1)).toBe('a');
  });

  it('returns the second player for round 2', () => {
    expect(getStoryteller(['a', 'b', 'c'], 2)).toBe('b');
  });

  it('returns the last player for the last position', () => {
    expect(getStoryteller(['a', 'b', 'c'], 3)).toBe('c');
  });

  it('wraps around after the last player', () => {
    expect(getStoryteller(['a', 'b', 'c'], 4)).toBe('a');
  });
});

describe('calculatePlayingOrder', () => {
  it('returns all player IDs', () => {
    const playersData = new Map([
      ['p1', { name: 'Alice', avatarId: 'avatar-1', score: 0, isConnected: true }],
      ['p2', { name: 'Bob', avatarId: 'avatar-2', score: 0, isConnected: true }],
      ['p3', { name: 'Carol', avatarId: 'avatar-3', score: 0, isConnected: true }],
    ]);
    const result = calculatePlayingOrder(playersData);
    expect(result).toHaveLength(3);
    expect(result).toContain('p1');
    expect(result).toContain('p2');
    expect(result).toContain('p3');
  });

  it('returns an empty array for no players', () => {
    expect(calculatePlayingOrder(new Map())).toEqual([]);
  });
});

describe('calculateScores', () => {
  it('all found it: storyteller gets 0, others get 2', () => {
    const result = calculateScores({
      storytellerId: 's',
      storytellerCard: 'card-s',
      submittedCards: new Map([
        ['p1', 'card-1'],
        ['p2', 'card-2'],
      ]),
      votes: new Map([
        ['p1', 'card-s'],
        ['p2', 'card-s'],
      ]),
    });
    expect(result.get('s')).toBe(0);
    expect(result.get('p1')).toBe(2);
    expect(result.get('p2')).toBe(2);
  });

  it('nobody found it: storyteller gets 0, others get 2 plus any bonus votes', () => {
    const result = calculateScores({
      storytellerId: 's',
      storytellerCard: 'card-s',
      submittedCards: new Map([
        ['p1', 'card-1'],
        ['p2', 'card-2'],
      ]),
      // p1 voted card-2, p2 voted card-1 — neither found storyteller's card
      votes: new Map([
        ['p1', 'card-2'],
        ['p2', 'card-1'],
      ]),
    });
    expect(result.get('s')).toBe(0);
    // Base 2 + 1 bonus vote each
    expect(result.get('p1')).toBe(3);
    expect(result.get('p2')).toBe(3);
  });

  it('normal case: storyteller gets 3, correct voters get 3', () => {
    const result = calculateScores({
      storytellerId: 's',
      storytellerCard: 'card-s',
      submittedCards: new Map([
        ['p1', 'card-1'],
        ['p2', 'card-2'],
      ]),
      // p1 found the storyteller's card, p2 voted for p2's own card
      votes: new Map([
        ['p1', 'card-s'],
        ['p2', 'card-2'],
      ]),
    });
    expect(result.get('s')).toBe(3);
    expect(result.get('p1')).toBe(3); // correct voter
    expect(result.get('p2')).toBe(1); // 0 + 1 vote for their own card
  });

  it('normal case with multiple voters for non-storyteller card', () => {
    const result = calculateScores({
      storytellerId: 's',
      storytellerCard: 'card-s',
      submittedCards: new Map([
        ['p1', 'card-1'],
        ['p2', 'card-2'],
        ['p3', 'card-3'],
      ]),
      // p1 found storyteller's card; p2 and p3 both voted for p1's card
      votes: new Map([
        ['p1', 'card-s'],
        ['p2', 'card-1'],
        ['p3', 'card-1'],
      ]),
    });
    expect(result.get('s')).toBe(3); // storyteller
    expect(result.get('p1')).toBe(3 + 2); // correct voter + 2 bonus votes
    expect(result.get('p2')).toBe(0);
    expect(result.get('p3')).toBe(0);
  });
});
