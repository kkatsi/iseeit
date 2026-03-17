import { describe, it, expect } from 'vitest';
import { ordinal } from '../ordinal';

describe('ordinal', () => {
  it('formats 1 as 1st', () => expect(ordinal(1)).toBe('1st'));
  it('formats 2 as 2nd', () => expect(ordinal(2)).toBe('2nd'));
  it('formats 3 as 3rd', () => expect(ordinal(3)).toBe('3rd'));
  it('formats 4 as 4th', () => expect(ordinal(4)).toBe('4th'));
  it('formats 11 as 11th (special case)', () => expect(ordinal(11)).toBe('11th'));
  it('formats 12 as 12th (special case)', () => expect(ordinal(12)).toBe('12th'));
  it('formats 13 as 13th (special case)', () => expect(ordinal(13)).toBe('13th'));
  it('formats 21 as 21st', () => expect(ordinal(21)).toBe('21st'));
  it('formats 22 as 22nd', () => expect(ordinal(22)).toBe('22nd'));
});
