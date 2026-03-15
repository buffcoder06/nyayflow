// src/lib/store/auth-store.ts
// Zustand store for authentication state in NyayVakil.
// Uses mock login backed by the mock API layer; swap api.auth.login for real
// implementation when the backend is ready.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';
import { api } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────────────────────
      user: null,
      token: null,
      status: 'idle',
      error: null,

      // ── Actions ───────────────────────────────────────────────────────────

      /**
       * Authenticate a user with email and password.
       * On success, persists user and token to localStorage.
       *
       * TODO: The api.auth.login call below maps to POST /api/auth/login
       */
      login: async (email: string, password: string): Promise<void> => {
        set({ status: 'loading', error: null });
        try {
          const response = await api.auth.login(email, password);
          set({
            user: response.data.user,
            token: response.data.token,
            status: 'authenticated',
            error: null,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
          set({ status: 'unauthenticated', error: message, user: null, token: null });
          throw err; // Re-throw so the UI can handle it
        }
      },

      /**
       * Log the current user out and clear persisted state.
       *
       * TODO: The api.auth.logout call maps to POST /api/auth/logout
       */
      logout: async (): Promise<void> => {
        set({ status: 'loading' });
        try {
          await api.auth.logout();
        } finally {
          // Always clear local state regardless of API outcome
          set({ user: null, token: null, status: 'unauthenticated', error: null });
        }
      },

      /**
       * Re-fetch the current user's profile (e.g., after token refresh).
       *
       * TODO: Maps to GET /api/auth/me
       */
      refreshUser: async (): Promise<void> => {
        const { user, token } = get();
        if (!user || !token) {
          set({ status: 'unauthenticated' });
          return;
        }
        try {
          const response = await api.auth.getMe(user.id);
          set({ user: response.data });
        } catch {
          set({ status: 'unauthenticated', user: null, token: null });
        }
      },

      /** Clear any auth error (e.g., after displaying the error to the user) */
      clearError: () => { set({ error: null }); },

      /** Directly set the user object (useful for profile updates) */
      setUser: (user: User) => { set({ user }); },
    }),
    {
      name: 'nyayvakil-auth', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist essential auth data, not transient status fields
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        // Restore as 'authenticated' on page reload if we have persisted data
        status: state.user ? 'authenticated' : 'unauthenticated',
      }),
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// SELECTORS (derived values – use these instead of accessing store directly)
// ─────────────────────────────────────────────────────────────────────────────

export const selectUser = (state: AuthState): User | null => state.user;
export const selectIsAuthenticated = (state: AuthState): boolean =>
  state.status === 'authenticated' && state.user !== null;
export const selectIsLoading = (state: AuthState): boolean => state.status === 'loading';
export const selectUserRole = (state: AuthState) => state.user?.role ?? null;
export const selectAuthError = (state: AuthState): string | null => state.error;

// ─────────────────────────────────────────────────────────────────────────────
// ROLE-BASED ACCESS HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const useIsAdvocate = (): boolean => {
  const role = useAuthStore(selectUserRole);
  return role === 'advocate';
};

export const useIsAdmin = (): boolean => {
  const role = useAuthStore(selectUserRole);
  return role === 'admin' || role === 'advocate';
};

export const useCanEditMatters = (): boolean => {
  const role = useAuthStore(selectUserRole);
  return role === 'advocate' || role === 'junior';
};

export const useCanManageFinance = (): boolean => {
  const role = useAuthStore(selectUserRole);
  return role === 'advocate' || role === 'admin';
};
