import type { User } from "../types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const userStr = localStorage.getItem("ptm-user");
    if (userStr) {
      try {
        const savedUser: User = JSON.parse(userStr);
        setUser(savedUser);
      } catch (error) {
        localStorage.removeItem("ptm-user");
      }
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      //POST /api/login
      const { data } = await api.post<User>("/login", { email, password });

      setUser(data);
      localStorage.setItem("ptm-user", JSON.stringify(data));

      toast.success(`Welcome back, ${data.name}! 🎧`);
      return true;
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.message ?? "Login failed")
          : "Login failed";
      toast.error(message);
      return false;
    }
  };

  // --- REGISTER ---

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const { data } = await api.post<User>("/register", {
        name,
        email,
        password,
      });

      setUser(data);
      localStorage.setItem("ptm-user", JSON.stringify(data));

      toast.success(`Welcome to Personal Task Manager, ${data.name}! 🎧`);
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return false;
    }
  };

  // LOGOUT

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("ptm-user");
    toast.success("Logged Out Successfully");
  };

  // UPDATE USER
  const updateUser = (updateData: Partial<User>): void => {
    if (user) {
      const updated = { ...user, ...updateData };
      setUser(updated);
      localStorage.setItem("ptm-user", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
