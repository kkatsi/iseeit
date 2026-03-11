export const wait = async (timeInMs: number) =>
  new Promise((res) => setTimeout(res, timeInMs));
export const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, rej) =>
      setTimeout(() => rej(new Error('Connection timed out')), ms),
    ),
  ]);
