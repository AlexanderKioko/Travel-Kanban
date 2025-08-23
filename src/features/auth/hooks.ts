import { useMutation } from "@tanstack/react-query";
import { useSession } from "@/store/useSession";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Types
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

// Mock API functions (replace with real API calls later)
const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (credentials.email === "test@example.com" && credentials.password === "password") {
    return {
      user: {
        id: "1",
        email: credentials.email,
        name: "Test User",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        createdAt: new Date().toISOString(),
      },
      token: "mock-jwt-token",
    };
  }
  
  throw new Error("Invalid email or password");
};

const mockRegister = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock validation
  if (credentials.password !== credentials.confirmPassword) {
    throw new Error("Passwords do not match");
  }
  
  if (credentials.password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  
  return {
    user: {
      id: "2",
      email: credentials.email,
      name: credentials.name,
      createdAt: new Date().toISOString(),
    },
    token: "mock-jwt-token-register",
  };
};

// Custom hooks
export function useLogin() {
  const { setUser } = useSession();
  const router = useRouter();

  return useMutation({
    mutationFn: mockLogin,
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
    mutationFn: mockRegister,
    onSuccess: (data) => {
      setUser(data.user, data.token);
      toast.success("Account created!", {
        description: "Welcome to TripBoard! Your account has been created successfully.",
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
    mutationFn: async () => {
      // Simulate API call to invalidate token
      await new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      clearUser();
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: () => {
      // Even if API call fails, clear local session
      clearUser();
      router.push("/login");
    },
  });
}

// Session sync hook for validating stored tokens
export function useSessionSync() {
  const { user, token, clearUser } = useSession();

  return useMutation({
    mutationFn: async () => {
      if (!user || !token) {
        throw new Error("No session data");
      }

      // Mock API call to validate token
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you'd call your API to validate the token
      // If token is invalid, throw an error
      
      return { user, token };
    },
    onError: () => {
      // If session validation fails, clear the session
      clearUser();
      toast.error("Session expired", {
        description: "Please log in again.",
      });
    },
  });
}