import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { UserRole } from "@/schemas/auth";

/**
 * Auth state shape stored in Context.
 * - token: JWT used for API calls
 * - role: current user's role (admin/supervisor/nurse)
 * - isLoading: true while we hydrate from localStorage on app start
 */
type AuthState = {
  token: string | null;
  role: UserRole | null;
  isLoading: boolean;
};

/**
 * Actions describe *what happened* (not *how to change state*).
 * Keeping them small & explicit improves readability and prevents bugs.
 */
type AuthAction =
  | { type: "INIT_FROM_STORAGE"; token: string | null; role: UserRole | null }
  | { type: "LOGIN_SUCCESS"; token: string; role: UserRole }
  | { type: "LOGOUT" };

/**
 * Initial state before hydration.
 */
const initialState: AuthState = {
  token: null,
  role: null,
  isLoading: true,
};

/**
 * Reducer is a *pure function*: given (state, action) => nextState
 * - No side effects here (no localStorage, no navigation) — keeps it predictable.
 * - Each case returns a brand new state object.
 */
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "INIT_FROM_STORAGE": {
      return { token: action.token, role: action.role, isLoading: false };
    }
    case "LOGIN_SUCCESS": {
      return {
        ...state,
        token: action.token,
        role: action.role,
        isLoading: false,
      };
    }
    case "LOGOUT": {
      return { token: null, role: null, isLoading: false };
    }
    default:
      return state;
  }
};

/**
 * Context value combines read-only state and imperative helpers (login/logout).
 * We keep the API surface small and semantic.
 */
const AuthContext = createContext<{
  state: AuthState;
  login: (token: string, role: UserRole) => void;
  logout: () => void;
} | null>(null);

/**
 * Provider ties everything together:
 * - useReducer drives state transitions
 * - useEffect hydrates from localStorage on mount
 * - login/logout *perform side effects* (localStorage + dispatch)
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    const token = localStorage.getItem("clinroster_token");
    const role = localStorage.getItem("clinroster_role") as UserRole | null;
    dispatch({ type: "INIT_FROM_STORAGE", token, role });
  }, []);

  // Imperative helpers are *outside* the reducer by design
  const login = (token: string, role: UserRole) => {
    localStorage.setItem("clinroster_token", token);
    localStorage.setItem("clinroster_role", role);
    dispatch({ type: "LOGIN_SUCCESS", token, role });
  };

  const logout = () => {
    localStorage.removeItem("clinroster_token");
    localStorage.removeItem("clinroster_role");
    dispatch({ type: "LOGOUT" });
  };

  // Memoize the context value to avoid unnecessary rerenders
  const value = useMemo(() => ({ state, login, logout }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Safe hook to consume the Auth context.
 * Throws early if used outside the provider — common team pitfall.
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
