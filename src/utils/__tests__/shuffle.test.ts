import { describe, it, expect } from 'vitest';
import { shuffleItems } from '../shuffle';

describe('shuffleItems', () => {
  it('returns an array with the same elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffleItems(input);
    expect(result).toHaveLength(input.length);
    for (const item of input) {
      expect(result).toContain(item);
    }
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3];
    shuffleItems(input);
    expect(input).toEqual([1, 2, 3]);
  });

  it('returns an empty array for empty input', () => {
    expect(shuffleItems([])).toEqual([]);
  });

  it('returns a single-element array unchanged', () => {
    expect(shuffleItems(['only'])).toEqual(['only']);
  });
});
