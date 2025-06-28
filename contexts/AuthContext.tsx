import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getDatabaseService,
  IDatabaseService,
} from "../services/DatabaseService";
import { User } from "../types/database";

// Production-ready auth state interface
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface ProductionAuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
  tokens: AuthTokens | null;
}

interface AuthContextType extends ProductionAuthState {
  login: (phone: string) => Promise<User | null>;
  register: (userData: Omit<User, "id" | "createdAt">) => Promise<User>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  refreshTokens: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// For development, we'll use a simple in-memory token store
// In production, this would be replaced with SecureStore
class TokenStorage {
  private static instance: TokenStorage;
  private tokens: AuthTokens | null = null;
  private userData: User | null = null;

  static getInstance(): TokenStorage {
    if (!TokenStorage.instance) {
      TokenStorage.instance = new TokenStorage();
    }
    return TokenStorage.instance;
  }

  async storeTokens(tokens: AuthTokens, user: User): Promise<void> {
    this.tokens = tokens;
    this.userData = user;
    console.log("🔐 Tokens and user stored:", {
      accessToken: tokens.accessToken.substring(0, 10) + "...",
      user: user.name,
    });
  }

  async getTokens(): Promise<AuthTokens | null> {
    return this.tokens;
  }

  async getUser(): Promise<User | null> {
    return this.userData;
  }

  async clearTokens(): Promise<void> {
    this.tokens = null;
    this.userData = null;
    console.log("🔐 Tokens and user cleared");
  }

  async isTokenExpired(): Promise<boolean> {
    if (!this.tokens) return true;
    return Date.now() > this.tokens.expiresAt;
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log("🏗️ AuthProvider being created/recreated");

  const [authState, setAuthState] = useState<ProductionAuthState>({
    isAuthenticated: false,
    currentUser: null,
    isLoading: true,
    tokens: null,
  });

  const tokenStorage = TokenStorage.getInstance();
  const database: IDatabaseService = useMemo(() => getDatabaseService(), []);

  // Check for existing session on app start
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        console.log("🔍 Checking for existing session...");

        const tokens = await tokenStorage.getTokens();
        if (tokens && !(await tokenStorage.isTokenExpired())) {
          console.log("✅ Found valid session, restoring auth state");
          // In production, you'd validate the token with your server
          // For now, we'll assume it's valid
          const user = await tokenStorage.getUser();
          setAuthState({
            isAuthenticated: true,
            currentUser: user,
            isLoading: false,
            tokens,
          });
        } else {
          console.log("❌ No valid session found");
          setAuthState({
            isAuthenticated: false,
            currentUser: null,
            isLoading: false,
            tokens: null,
          });
        }
      } catch (error) {
        console.error("❌ Error checking session:", error);
        setAuthState({
          isAuthenticated: false,
          currentUser: null,
          isLoading: false,
          tokens: null,
        });
      }
    };

    checkExistingSession();
  }, []);

  const generateTokens = (user: User): AuthTokens => {
    // In production, this would come from your auth server
    return {
      accessToken: `dev_token_${user.id}_${Date.now()}`,
      refreshToken: `dev_refresh_${user.id}_${Date.now()}`,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
  };

  const login = async (phone: string): Promise<User | null> => {
    try {
      console.log("🔐 Attempting login with phone:", phone);
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const user = await database.getUserByPhone(phone);
      console.log("📱 User lookup result:", user ? "Found" : "Not found");

      if (user) {
        console.log("✅ Login successful for user:", user.name);

        // Generate tokens (in production, this would come from your auth server)
        const tokens = generateTokens(user);
        await tokenStorage.storeTokens(tokens, user);

        return new Promise<User>((resolve) => {
          const newAuthState = {
            isAuthenticated: true,
            currentUser: user,
            isLoading: false,
            tokens,
          };

          console.log("🔐 Setting auth state:", newAuthState);
          setAuthState(newAuthState);

          // Resolve after state update
          resolve(user);
        });
      } else {
        console.log("❌ Login failed - user not found");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return null;
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (
    userData: Omit<User, "id" | "createdAt">
  ): Promise<User> => {
    try {
      console.log("📝 Starting registration process...");
      console.log("📋 Registration data:", userData);

      setAuthState((prev) => ({ ...prev, isLoading: true }));

      console.log("🗄️ Calling database.createUser...");
      const newUser = await database.createUser(userData);
      console.log("✅ User created successfully:", newUser);

      // Generate tokens (in production, this would come from your auth server)
      const tokens = generateTokens(newUser);
      await tokenStorage.storeTokens(tokens, newUser);

      console.log("🔐 Setting authentication state...");
      const newAuthState = {
        isAuthenticated: true,
        currentUser: newUser,
        isLoading: false,
        tokens,
      };

      setAuthState(newAuthState);
      console.log("✅ Registration complete - user is now authenticated");
      return newUser;
    } catch (error) {
      console.error("❌ Registration error:", error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    console.log("🚪 Logging out user:", authState.currentUser?.name);

    // Clear tokens
    await tokenStorage.clearTokens();

    // In production, you'd also revoke tokens on the server
    // await api.post('/auth/logout', { refreshToken: authState.tokens?.refreshToken });

    setAuthState({
      isAuthenticated: false,
      currentUser: null,
      isLoading: false,
      tokens: null,
    });
    console.log("✅ Logout complete");
  };

  const refreshTokens = async (): Promise<boolean> => {
    try {
      const currentTokens = await tokenStorage.getTokens();
      if (!currentTokens) return false;

      // In production, you'd call your auth server to refresh tokens
      // const newTokens = await api.post('/auth/refresh', { refreshToken: currentTokens.refreshToken });

      // For development, we'll just generate new tokens
      if (authState.currentUser) {
        const newTokens = generateTokens(authState.currentUser);
        await tokenStorage.storeTokens(newTokens, authState.currentUser);

        setAuthState((prev) => ({
          ...prev,
          tokens: newTokens,
        }));

        console.log("✅ Tokens refreshed successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      await logout(); // Force logout if refresh fails
      return false;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!authState.currentUser) {
      throw new Error("No user logged in");
    }

    try {
      console.log("🔄 Updating user:", authState.currentUser.name);
      await database.updateUser(authState.currentUser.id, updates);

      const updatedUser = await database.getUserById(authState.currentUser.id);
      if (updatedUser) {
        console.log("✅ User updated successfully");
        setAuthState((prev) => ({
          ...prev,
          currentUser: updatedUser,
        }));
      }
    } catch (error) {
      console.error("❌ Update user error:", error);
      throw error;
    }
  };

  const value: AuthContextType = useMemo(
    () => ({
      ...authState,
      login,
      register,
      logout,
      updateUser,
      refreshTokens,
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
