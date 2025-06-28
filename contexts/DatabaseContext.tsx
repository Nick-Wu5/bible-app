import React, { createContext, useContext, useEffect, useState } from "react";
import { SQLiteService } from "../services/SQLiteService";
import { DatabaseService } from "../types/database";

interface DatabaseContextType {
  database: DatabaseService | null;
  isLoading: boolean;
  error: string | null;
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

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const db = new SQLiteService();
      setDatabase(db);
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
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
