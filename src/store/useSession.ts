import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

interface SessionState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User, token: string) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      clearUser: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "session-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      } as const),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Rehydration complete — now we can set auth state
          if (state.user && state.token) {
            state.isAuthenticated = true;
          }
          state.isLoading = false;
        }
      },
    }
  )
);