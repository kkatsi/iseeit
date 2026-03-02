interface SaveProps {
  name: string;
  value: string | number | boolean | object;
}

function isSessionStorageSupported() {
  try {
    sessionStorage.setItem('storage', 'supported');
    sessionStorage.removeItem('storage');
    return true;
  } catch (e) {
    return false;
  }
}

export const getFromSessionStorage = (name: string) => {
  if (isSessionStorageSupported()) {
    const item = sessionStorage.getItem(name);
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

export const saveToSessionStorage = ({ name, value }: SaveProps) => {
  if (isSessionStorageSupported()) {
    const valueToStore =
      typeof value === 'object' ? JSON.stringify(value) : String(value);
    sessionStorage.setItem(name, valueToStore);
  }
};

export const removeFromSessionStorage = (name: string) => {
  if (isSessionStorageSupported()) sessionStorage.removeItem(name);
};
