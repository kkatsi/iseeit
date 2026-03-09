export const wait = async (timeInMs: number) =>
  new Promise((res) => setTimeout(res, timeInMs));
