const ordinalRules = new Intl.PluralRules('en', { type: 'ordinal' });
const ordinalSuffixes: Record<Intl.LDMLPluralRule, string> = {
  one: 'st',
  two: 'nd',
  few: 'rd',
  other: 'th',
  zero: 'th',
  many: 'th',
};
export const ordinal = (n: number) =>
  n + ordinalSuffixes[ordinalRules.select(n)];
