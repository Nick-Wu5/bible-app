export interface Verse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  reference: string;
  translation: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  denomination?: string;
  preferredTranslation: string;
  createdAt: Date;
  // Future fields for cloud sync:
  // email?: string;
  // authProvider?: 'local' | 'firebase' | 'apple';
  // lastSyncAt?: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
}

export interface DatabaseService {
  createUser(user: Omit<User, "id" | "createdAt">): Promise<User>;
  getUserByPhone(phone: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  updateUser(userId: string, updates: Partial<User>): Promise<void>;
  addVerse(
    verse: Omit<Verse, "id" | "createdAt" | "updatedAt">
  ): Promise<Verse>;
  getVersesByUser(userId: string): Promise<Verse[]>;
  getVerse(id: string): Promise<Verse | null>;
  updateVerse(id: string, updates: Partial<Verse>): Promise<void>;
  deleteVerse(id: string): Promise<void>;
  getAllVerses(): Promise<Verse[]>;
  getAllUsers(): Promise<User[]>;
  resetDatabase(): Promise<void>;
}
