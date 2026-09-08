import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  subscription: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  setSession: (session: { token: string; user: AuthUser }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (session) => set({ token: session.token, user: session.user }),
      logout: () => set({ token: null, user: null })
    }),
    {
      name: "tradelmt-auth"
    }
  )
);
