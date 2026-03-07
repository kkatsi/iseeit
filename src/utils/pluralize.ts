export const pluralize = (singular: string, plural: string, count: number) =>
  count === 1 ? singular : plural;
