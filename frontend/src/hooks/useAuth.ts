import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient, tokenManager, User as ApiUser, AuthResponse as ApiAuthResponse } from '@/lib/api';
import { useSession } from '@/store/useSession';

// --- Types ---
interface AuthState {
  user: ApiUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; username: string; email: string; password: string; password_confirm: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

// --- Helper Function to Map API User to Session User ---
const mapApiUserToSessionUser = (apiUser: ApiUser) => ({
  id: apiUser.id.toString(),
  email: apiUser.email,
  name: `${apiUser.first_name} ${apiUser.last_name}`,
  createdAt: apiUser.created_at,
});

// --- Main Hook ---
export function useAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });
  const router = useRouter();
  const { setUser, clearUser } = useSession();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const hasToken = !!tokenManager.getAccessToken();
      if (!hasToken) {
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }
      try {
        const response = await apiClient.getCurrentUser();
        setState({
          user: response.user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Failed to get current user:', error);
        tokenManager.clearTokens();
        setState({
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        });
      }
    };
    initializeAuth();
  }, []);

  // --- Actions ---
  const login = useCallback(
    async (data: { email: string; password: string }) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await apiClient.login(data);
        tokenManager.setTokens(response.tokens);
        const sessionUser = mapApiUserToSessionUser(response.user);
        setUser(sessionUser, response.tokens.access);
        setState({
          user: response.user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
        toast.success('Welcome back!');
        router.push('/dashboard');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Login failed';
        setState((prev) => ({ ...prev, loading: false, error: message }));
        toast.error('Login failed', { description: message });
        throw error;
      }
    },
    [router, setUser]
  );

  const register = useCallback(
    async (data: { name: string; username: string; email: string; password: string; password_confirm: string }) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        if (data.password !== data.password_confirm) {
          throw new Error('Passwords do not match');
        }
        if (data.password.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }

        // Split the name into first_name and last_name
        const [first_name, ...last_name] = data.name.split(' ');
        const response = await apiClient.register({
          username: data.username,
          email: data.email,
          first_name: first_name,
          last_name: last_name.join(' '),
          password: data.password,
          password_confirm: data.password_confirm,
        });

        tokenManager.setTokens(response.tokens);
        const sessionUser = mapApiUserToSessionUser(response.user);
        setUser(sessionUser, response.tokens.access);
        setState({
          user: response.user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
        toast.success('Account created!');
        router.push('/boards/dashboard');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        setState((prev) => ({ ...prev, loading: false, error: message }));
        toast.error('Registration failed', { description: message });
        throw error;
      }
    },
    [router, setUser]
  );

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    tokenManager.clearTokens();
    clearUser();
    setState({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    });
    toast.success('Logged out successfully');
    router.push('/login');
  }, [router, clearUser]);

  const refreshUser = useCallback(async () => {
    if (!tokenManager.getAccessToken()) return;
    try {
      const response = await apiClient.getCurrentUser();
      setState((prev) => ({
        ...prev,
        user: response.user,
        isAuthenticated: true,
      }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setState((prev) => ({
        ...prev,
        user: null,
        isAuthenticated: false,
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  };
}
