import React, { createContext, useContext, useEffect, useState } from "react";
import { SQLiteService } from "../services/SQLiteService";
import { DatabaseService, User } from "../types/database";

interface DatabaseContextType {
  database: DatabaseService | null;
  isLoading: boolean;
  error: string | null;
  // Mock user for now (we'll add authentication later)
  currentUser: User | null;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children,
}) => {
  const [database, setDatabase] = useState<DatabaseService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const db = new SQLiteService();
      await db.initializeDatabase();
      setDatabase(db);

      // Create a mock user for development
      const mockUser: Omit<User, "id" | "createdAt"> = {
        name: "Test User",
        phone: "+1234567890",
        denomination: "Christian",
        preferredTranslation: "NIV",
      };

      const userId = await db.saveUser(mockUser);
      const user = await db.getUser(userId);
      setCurrentUser(user);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initialize database"
      );
      console.error("Database initialization error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const value: DatabaseContextType = {
    database,
    isLoading,
    error,
    currentUser,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
