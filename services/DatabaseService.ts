import { User, Verse } from "../types/database";

// Abstract interface for database operations
// This makes it easy to swap between SQLite and cloud databases
export interface IDatabaseService {
  // User operations
  createUser(user: Omit<User, "id" | "createdAt">): Promise<User>;
  getUserByPhone(phone: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  updateUser(userId: string, updates: Partial<User>): Promise<void>;

  // Verse operations
  addVerse(
    verse: Omit<Verse, "id" | "createdAt" | "updatedAt">
  ): Promise<Verse>;
  getVersesByUser(userId: string): Promise<Verse[]>;
  getVerse(id: string): Promise<Verse | null>;
  updateVerse(id: string, updates: Partial<Verse>): Promise<void>;
  deleteVerse(id: string): Promise<void>;

  // Debug/utility operations
  getAllVerses(): Promise<Verse[]>;
  getAllUsers(): Promise<User[]>;
  resetDatabase(): Promise<void>;
}

// Factory function to get the appropriate database service
// This will make it easy to switch between local and cloud databases
export function getDatabaseService(): IDatabaseService {
  // For now, return SQLite service
  // Later, this could check environment variables or user preferences
  // to return Firebase, Supabase, or other cloud services

  // Example for future cloud migration:
  // const useCloudDatabase = process.env.USE_CLOUD_DB === 'true';
  // if (useCloudDatabase) {
  //   return new FirebaseService();
  // } else {
  //   return new SQLiteService();
  // }

  const { SQLiteService } = require("./SQLiteService");
  return new SQLiteService();
}
