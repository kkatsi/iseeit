interface SaveProps {
  name: string;
  value: string | number | boolean | object;
}

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

export const getFromLocalStorage = (name: string) => {
  if (isLocalStorageSupported()) {
    const item = localStorage.getItem(name);
    if (item) {
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    }
  }
  return undefined;
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
