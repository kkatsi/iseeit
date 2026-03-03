export function createIterator<T>(items: T[]) {
  let i = 0;
  return {
    next() {
      if (i < items.length) return { value: items[i++], done: false };
      return { value: undefined, done: true };
    },
    reset() {
      i = 0;
    },
  };
}
