import axios, { AxiosError } from "axios";

const raw = import.meta.env.VITE_API_BASE_URL;
if (!raw) {
  console.warn(
    "[api] VITE_API_BASE_URL is not set; falling back to http://localhost:5000"
  );
}
const baseURL = (raw ?? "http://localhost:5000").replace(/\/+$/, "");

export const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

/** Single source of truth for the token key */
export const AUTH_TOKEN_KEY = "clinroster_token";

export const authToken = {
  get(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
  set(token: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};

/**
 * Lightweight pub/sub for 401 events so the AuthContext
 * can react (logout) without importing Context here.
 */
const unauthorizedListeners = new Set<() => void>();
export const onUnauthorized = (listener: () => void) => {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
};

api.interceptors.request.use((config) => {
  const t = authToken.get();
  if (t) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${t}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      authToken.clear();
      unauthorizedListeners.forEach((fn) => fn());
    }
    return Promise.reject(error);
  }
);
