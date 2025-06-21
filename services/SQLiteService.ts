import * as SQLite from "expo-sqlite";
import { DatabaseService, User, Verse } from "../types/database";

export class SQLiteService implements DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initializeDatabase(): Promise<void> {
    this.db = await SQLite.openDatabaseAsync("bible-app.db");

    // Create tables
    await this.createTables();
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    // Create users table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        denomination TEXT,
        preferredTranslation TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);

    // Create verses table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS verses (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        reference TEXT NOT NULL,
        book TEXT NOT NULL,
        chapter INTEGER NOT NULL,
        verse INTEGER NOT NULL,
        translation TEXT NOT NULL,
        dateAdded TEXT NOT NULL,
        userId TEXT NOT NULL,
        notes TEXT,
        tags TEXT,
        FOREIGN KEY (userId) REFERENCES users (id)
      );
    `);
  }

  // Verse operations
  async saveVerse(verse: Omit<Verse, "id" | "dateAdded">): Promise<string> {
    if (!this.db) throw new Error("Database not initialized");

    const id = this.generateId();
    const dateAdded = new Date().toISOString();
    const tags = JSON.stringify(verse.tags);

    await this.db.runAsync(
      `INSERT INTO verses (id, content, reference, book, chapter, verse, translation, dateAdded, userId, notes, tags) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        verse.content,
        verse.reference,
        verse.book,
        verse.chapter,
        verse.verse,
        verse.translation,
        dateAdded,
        verse.userId,
        verse.notes || null,
        tags,
      ]
    );

    return id;
  }

  async getVerses(userId: string): Promise<Verse[]> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getAllAsync(
      `SELECT * FROM verses WHERE userId = ? ORDER BY dateAdded DESC`,
      [userId]
    );

    return result.map((row: any) => ({
      ...row,
      dateAdded: new Date(row.dateAdded),
      tags: JSON.parse(row.tags || "[]"),
    })) as Verse[];
  }

  async getVerse(id: string): Promise<Verse | null> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getFirstAsync(
      `SELECT * FROM verses WHERE id = ?`,
      [id]
    );

    if (!result) return null;

    const verseResult = result as any;
    return {
      ...verseResult,
      dateAdded: new Date(verseResult.dateAdded),
      tags: JSON.parse(verseResult.tags || "[]"),
    } as Verse;
  }

  async updateVerse(verse: Verse): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    const tags = JSON.stringify(verse.tags);

    await this.db.runAsync(
      `UPDATE verses SET content = ?, reference = ?, book = ?, chapter = ?, verse = ?, translation = ?, userId = ?, notes = ?, tags = ? WHERE id = ?`,
      [
        verse.content,
        verse.reference,
        verse.book,
        verse.chapter,
        verse.verse,
        verse.translation,
        verse.userId,
        verse.notes || null,
        tags,
        verse.id,
      ]
    );
  }

  async deleteVerse(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(`DELETE FROM verses WHERE id = ?`, [id]);
  }

  // User operations
  async saveUser(user: Omit<User, "id" | "createdAt">): Promise<string> {
    if (!this.db) throw new Error("Database not initialized");

    const id = this.generateId();
    const createdAt = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO users (id, name, phone, denomination, preferredTranslation, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        user.name,
        user.phone || null,
        user.denomination || null,
        user.preferredTranslation,
        createdAt,
      ]
    );

    return id;
  }

  async getUser(id: string): Promise<User | null> {
    if (!this.db) throw new Error("Database not initialized");

    const result = await this.db.getFirstAsync(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );

    if (!result) return null;

    const userResult = result as any;
    return {
      ...userResult,
      createdAt: new Date(userResult.createdAt),
    } as User;
  }

  async updateUser(user: User): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(
      `UPDATE users SET name = ?, phone = ?, denomination = ?, preferredTranslation = ? WHERE id = ?`,
      [
        user.name,
        user.phone || null,
        user.denomination || null,
        user.preferredTranslation,
        user.id,
      ]
    );
  }

  async deleteUser(id: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    await this.db.runAsync(`DELETE FROM users WHERE id = ?`, [id]);
  }

  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}
