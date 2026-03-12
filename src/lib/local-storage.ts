import { z } from 'zod';

interface SaveProps {
  name: string;
  value: string | number | boolean | object;
}

const localStorageStateSchema = z.object({
  playerId: z.uuidv4(),
  roomId: z.string(),
});

export type LocalStorageState = z.infer<typeof localStorageStateSchema>;

function isLocalStorageSupported() {
  try {
    localStorage.setItem('storage', 'supported');
    localStorage.removeItem('storage');
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e: unknown) {
    return false;
  }
}

export const getFromLocalStorage = (
  name: string,
): LocalStorageState | undefined => {
  if (!isLocalStorageSupported()) return undefined;
  const item = localStorage.getItem(name);
  if (!item) return undefined;
  try {
    const parsed: unknown = JSON.parse(item);
    return localStorageStateSchema.parse(parsed);
  } catch {
    localStorage.removeItem(name);
    return undefined;
  }
};

export const saveToLocalStorage = ({ name, value }: SaveProps) => {
  if (isLocalStorageSupported()) {
    const valueToStore =
      typeof value === 'object' ? JSON.stringify(value) : String(value);
    localStorage.setItem(name, valueToStore);
  }
};

export const removeFromLocalStorage = (name: string) => {
  if (isLocalStorageSupported()) localStorage.removeItem(name);
};
