import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/store/useSession";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiClient, tokenManager, AuthResponse as ApiAuthResponse, User as ApiUser } from "@/lib/api";

// --- Types ---
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: string;
  };
  token: string;
}

// --- Helper Functions ---
const mapApiUserToAuthResponse = (apiUser: ApiUser, accessToken: string): AuthResponse => ({
  user: {
    id: apiUser.id.toString(),
    email: apiUser.email,
    name: `${apiUser.first_name} ${apiUser.last_name}`,
    createdAt: apiUser.created_at,
  },
  token: accessToken,
});

const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.login(credentials);
  return mapApiUserToAuthResponse(response.user, response.tokens.access);
};

const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const { name, email, password, confirmPassword } = credentials;
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  const [first_name, ...last_name] = name.split(" ");
  const response = await apiClient.register({
    username: email.split("@")[0],
    email,
    full_name: name,
    password,
    password_confirm: confirmPassword,
  });
  return mapApiUserToAuthResponse(response.user, response.tokens.access);
};

const logout = async (): Promise<void> => {
  await apiClient.logout();
};

const validateSession = async (): Promise<AuthResponse> => {
  const response = await apiClient.getCurrentUser();
  const token = tokenManager.getAccessToken();
  if (!token) throw new Error("No access token");
  return mapApiUserToAuthResponse(response.user, token);
};

// --- Custom Hooks ---
export function useLogin() {
  const { setUser } = useSession();
  const router = useRouter();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.user, data.token);
      toast.success("Welcome back!", {
        description: "You have been successfully logged in.",
      });
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error("Login failed", {
        description: error.message,
      });
    },
  });
}

export function useRegister() {
  const { setUser } = useSession();
  const router = useRouter();
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      setUser(data.user, data.token);
      toast.success("Account created!", {
        description: "Welcome! Your account has been created successfully.",
      });
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error("Registration failed", {
        description: error.message,
      });
    },
  });
}

export function useLogout() {
  const { clearUser } = useSession();
  const router = useRouter();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearUser();
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: () => {
      clearUser();
      router.push("/login");
    },
  });
}

export function useSessionSync() {
  const { user, token, clearUser } = useSession();
  return useMutation({
    mutationFn: validateSession,
    onError: () => {
      clearUser();
      toast.error("Session expired", {
        description: "Please log in again.",
      });
    },
  });
}
