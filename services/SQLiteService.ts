import * as SQLite from "expo-sqlite";
import { User, Verse } from "../types/database";
import { IDatabaseService } from "./DatabaseService";

export class SQLiteService implements IDatabaseService {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync("bible_app.db");
    this.initDatabase();
  }

  private async initDatabase(): Promise<void> {
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL UNIQUE,
        denomination TEXT,
        preferredTranslation TEXT NOT NULL DEFAULT 'NIV',
        createdAt TEXT NOT NULL
      );
    `);

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS verses (
        id TEXT PRIMARY KEY,
        book TEXT NOT NULL,
        chapter INTEGER NOT NULL,
        verse INTEGER NOT NULL,
        content TEXT NOT NULL,
        reference TEXT NOT NULL,
        translation TEXT NOT NULL,
        userId TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id)
      );
    `);

    // Migrate existing database if needed
    await this.migrateDatabase();
  }

  private async migrateDatabase(): Promise<void> {
    try {
      // Check if users table has updatedAt column
      const columns = await this.db.getAllAsync("PRAGMA table_info(users)");
      const hasUpdatedAt = (columns as any[]).some(
        (col: any) => col.name === "updatedAt"
      );

      if (hasUpdatedAt) {
        console.log(
          "Migrating database: removing updatedAt column from users table"
        );

        // Create new table without updatedAt
        await this.db.execAsync(`
          CREATE TABLE users_new (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            phone TEXT NOT NULL UNIQUE,
            denomination TEXT,
            preferredTranslation TEXT NOT NULL DEFAULT 'NIV',
            createdAt TEXT NOT NULL
          );
        `);

        // Copy data from old table to new table
        await this.db.execAsync(`
          INSERT INTO users_new (id, name, phone, denomination, preferredTranslation, createdAt)
          SELECT id, name, phone, denomination, preferredTranslation, createdAt FROM users;
        `);

        // Drop old table and rename new table
        await this.db.execAsync("DROP TABLE users");
        await this.db.execAsync("ALTER TABLE users_new RENAME TO users");

        console.log("Database migration completed successfully");
      }
    } catch (error) {
      console.error("Migration error:", error);
      // If migration fails, we'll continue with the existing schema
    }
  }

  saveVerse(verse: Omit<Verse, "id" | "dateAdded">): Promise<string> {
    throw new Error("Method not implemented.");
  }

  getVerses(userId: string): Promise<Verse[]> {
    throw new Error("Method not implemented.");
  }

  saveUser(user: Omit<User, "id" | "createdAt">): Promise<string> {
    throw new Error("Method not implemented.");
  }

  getUser(id: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  deleteUser(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  initializeDatabase(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  closeDatabase(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  // User Authentication Methods
  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    try {
      console.log("🗄️ SQLiteService.createUser called with:", user);

      const id = this.generateId();
      const now = new Date().toISOString();

      console.log("🆔 Generated user ID:", id);
      console.log("⏰ Created timestamp:", now);

      console.log("💾 Executing database insert...");
      await this.db.runAsync(
        `INSERT INTO users (id, name, phone, denomination, preferredTranslation, createdAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id,
          user.name,
          user.phone,
          user.denomination || null,
          user.preferredTranslation,
          now,
        ]
      );
      console.log("✅ Database insert successful");

      const newUser: User = {
        id,
        name: user.name,
        phone: user.phone,
        denomination: user.denomination,
        preferredTranslation: user.preferredTranslation,
        createdAt: new Date(now),
      };

      console.log("👤 Created user object:", newUser);
      return newUser;
    } catch (error) {
      console.error("❌ SQLiteService.createUser error:", error);
      console.error("❌ Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  async getUserByPhone(phone: string): Promise<User | null> {
    const result = await this.db.getFirstAsync(
      "SELECT * FROM users WHERE phone = ?",
      [phone]
    );

    if (!result) return null;

    const userData = result as any;
    return {
      id: userData.id,
      name: userData.name,
      phone: userData.phone,
      denomination: userData.denomination,
      preferredTranslation: userData.preferredTranslation,
      createdAt: new Date(userData.createdAt),
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.db.getFirstAsync(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (!result) return null;

    const userData = result as any;
    return {
      id: userData.id,
      name: userData.name,
      phone: userData.phone,
      denomination: userData.denomination,
      preferredTranslation: userData.preferredTranslation,
      createdAt: new Date(userData.createdAt),
    };
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const updateFields = [];
    const updateValues = [];

    if (updates.name !== undefined) {
      updateFields.push("name = ?");
      updateValues.push(updates.name);
    }
    if (updates.denomination !== undefined) {
      updateFields.push("denomination = ?");
      updateValues.push(updates.denomination);
    }
    if (updates.preferredTranslation !== undefined) {
      updateFields.push("preferredTranslation = ?");
      updateValues.push(updates.preferredTranslation);
    }

    updateValues.push(userId);

    await this.db.runAsync(
      `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );
  }

  // Verse Methods (updated to include userId)
  async addVerse(
    verse: Omit<Verse, "id" | "createdAt" | "updatedAt">
  ): Promise<Verse> {
    const id = this.generateId();
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO verses (id, book, chapter, verse, content, reference, translation, userId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        verse.book,
        verse.chapter,
        verse.verse,
        verse.content,
        verse.reference,
        verse.translation,
        verse.userId,
        now,
        now,
      ]
    );

    const newVerse: Verse = {
      id,
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verse,
      content: verse.content,
      reference: verse.reference,
      translation: verse.translation,
      userId: verse.userId,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };

    return newVerse;
  }

  async getVersesByUser(userId: string): Promise<Verse[]> {
    const result = await this.db.getAllAsync(
      "SELECT * FROM verses WHERE userId = ? ORDER BY createdAt DESC",
      [userId]
    );

    return result.map((row: any) => ({
      id: row.id,
      book: row.book,
      chapter: row.chapter,
      verse: row.verse,
      content: row.content,
      reference: row.reference,
      translation: row.translation,
      userId: row.userId,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  async getVerse(id: string): Promise<Verse | null> {
    const result = await this.db.getFirstAsync(
      "SELECT * FROM verses WHERE id = ?",
      [id]
    );

    if (!result) return null;

    const verseData = result as any;
    return {
      id: verseData.id,
      book: verseData.book,
      chapter: verseData.chapter,
      verse: verseData.verse,
      content: verseData.content,
      reference: verseData.reference,
      translation: verseData.translation,
      userId: verseData.userId,
      createdAt: new Date(verseData.createdAt),
      updatedAt: new Date(verseData.updatedAt),
    };
  }

  async updateVerse(id: string, updates: Partial<Verse>): Promise<void> {
    const now = new Date().toISOString();
    const updateFields = [];
    const updateValues = [];

    if (updates.content !== undefined) {
      updateFields.push("content = ?");
      updateValues.push(updates.content);
    }
    if (updates.translation !== undefined) {
      updateFields.push("translation = ?");
      updateValues.push(updates.translation);
    }

    updateFields.push("updatedAt = ?");
    updateValues.push(now);
    updateValues.push(id);

    await this.db.runAsync(
      `UPDATE verses SET ${updateFields.join(", ")} WHERE id = ?`,
      updateValues
    );
  }

  async deleteVerse(id: string): Promise<void> {
    await this.db.runAsync("DELETE FROM verses WHERE id = ?", [id]);
  }

  // Debug Methods
  async getAllVerses(): Promise<Verse[]> {
    const result = await this.db.getAllAsync(
      "SELECT * FROM verses ORDER BY createdAt DESC"
    );

    return result.map((row: any) => ({
      id: row.id,
      book: row.book,
      chapter: row.chapter,
      verse: row.verse,
      content: row.content,
      reference: row.reference,
      translation: row.translation,
      userId: row.userId,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  async getAllUsers(): Promise<User[]> {
    const result = await this.db.getAllAsync(
      "SELECT * FROM users ORDER BY createdAt DESC"
    );

    return result.map((row: any) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      denomination: row.denomination,
      preferredTranslation: row.preferredTranslation,
      createdAt: new Date(row.createdAt),
    }));
  }

  async resetDatabase(): Promise<void> {
    await this.db.runAsync("DELETE FROM verses");
    await this.db.runAsync("DELETE FROM users");
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
