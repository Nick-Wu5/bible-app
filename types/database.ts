export interface Verse {
  id: string;
  content: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  translation: string;
  dateAdded: Date;
  userId: string;
  notes?: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  phone?: string;
  denomination?: string;
  preferredTranslation: string;
  createdAt: Date;
}

export interface DatabaseService {
  // Verse operations
  saveVerse(verse: Omit<Verse, "id" | "dateAdded">): Promise<string>;
  getVerses(userId: string): Promise<Verse[]>;
  getVerse(id: string): Promise<Verse | null>;
  updateVerse(verse: Verse): Promise<void>;
  deleteVerse(id: string): Promise<void>;

  // User operations
  saveUser(user: Omit<User, "id" | "createdAt">): Promise<string>;
  getUser(id: string): Promise<User | null>;
  updateUser(user: User): Promise<void>;
  deleteUser(id: string): Promise<void>;

  // Utility operations
  initializeDatabase(): Promise<void>;
  closeDatabase(): Promise<void>;
}
