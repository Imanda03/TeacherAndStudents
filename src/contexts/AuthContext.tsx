import { createContext, useContext, useReducer, useMemo } from "react";
import type { ReactNode } from "react";

type Role = "teacher" | "student";

type AuthState = {
  isAuthenticated: boolean;
  role: Role;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
};

type AuthAction =
  | { type: "LOGIN"; payload: { role: Role; name: string; email: string } }
  | { type: "LOGOUT" }
  | { type: "SWITCH_ROLE"; payload: Role };

const initialState: AuthState = {
  isAuthenticated: true,
  role: "teacher",
  user: {
    id: "user_001",
    name: "Alex Teacher",
    email: "alex.teacher@example.com",
    avatar: "https://placehold.co/48x48",
  },
};

const AuthContext = createContext<{
  state: AuthState;
  login: (role: Role, name: string, email: string) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
} | null>(null);

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        role: action.payload.role,
        user: {
          ...state.user,
          name: action.payload.name,
          email: action.payload.email,
        },
      };
    case "LOGOUT":
      return { ...initialState, isAuthenticated: false };
    case "SWITCH_ROLE":
      return { ...state, role: action.payload };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(
    () => ({
      state,
      login: (role: Role, name: string, email: string) =>
        dispatch({ type: "LOGIN", payload: { role, name, email } }),
      logout: () => dispatch({ type: "LOGOUT" }),
      switchRole: (role: Role) =>
        dispatch({ type: "SWITCH_ROLE", payload: role }),
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
