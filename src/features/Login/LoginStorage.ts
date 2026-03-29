export const AUTH_STORAGE_KEY = 'housekeeping-auth';

export type StoredAuth = {
  role: string;
  token: string;
  tokenType: string;
  userName: string;
};

export const readStoredAuth = (): StoredAuth | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as StoredAuth;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const writeStoredAuth = (payload: StoredAuth) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
};

export const clearStoredAuth = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getAccessToken = () => readStoredAuth()?.token ?? null;
