import * as SQLite from "expo-sqlite";
import { SQLiteService } from "../services/SQLiteService";

// Debug function to view all database contents
export async function debugDatabase() {
  try {
    const db = await SQLite.openDatabaseAsync("bible-app.db");

    console.log("🔍 === DATABASE DEBUG INFO ===");

    // Get database info
    console.log("📁 Database file opened successfully");

    // View users table
    const users = await db.getAllAsync("SELECT * FROM users");
    console.log("👥 USERS TABLE:");
    console.log(JSON.stringify(users, null, 2));

    // View verses table
    const verses = await db.getAllAsync("SELECT * FROM verses");
    console.log("📖 VERSES TABLE:");
    console.log(JSON.stringify(verses, null, 2));

    // Get table schemas
    const userSchema = await db.getAllAsync("PRAGMA table_info(users)");
    const verseSchema = await db.getAllAsync("PRAGMA table_info(verses)");

    console.log("🏗️ USERS TABLE SCHEMA:");
    console.log(JSON.stringify(userSchema, null, 2));

    console.log("🏗️ VERSES TABLE SCHEMA:");
    console.log(JSON.stringify(verseSchema, null, 2));

    console.log("🔍 === END DATABASE DEBUG ===");
  } catch (error) {
    console.error("❌ Database debug error:", error);
  }
}

// Function to add test data
export async function addTestData() {
  try {
    const dbService = new SQLiteService();

    // Add a test user
    const testUser = await dbService.createUser({
      name: "Debug User",
      phone: "+1234567890",
      denomination: "Christian",
      preferredTranslation: "NIV",
    });

    console.log("✅ Test user created:", testUser);

    // Add a test verse
    const testVerse = await dbService.addVerse({
      content:
        "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      reference: "John 3:16",
      book: "John",
      chapter: 3,
      verse: 16,
      translation: "NIV",
      userId: testUser.id,
    });

    console.log("✅ Test verse created:", testVerse);

    // View the updated database
    await debugDatabase();
  } catch (error) {
    console.error("❌ Error adding test data:", error);
  }
}

// Function to reset database (WARNING: This deletes all data!)
export async function resetDatabase() {
  try {
    const dbService = new SQLiteService();

    console.log("🗑️ Resetting database...");

    await dbService.resetDatabase();

    console.log("✅ Database reset complete");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
  }
}

// Function to get database file info
export async function getDatabaseInfo() {
  try {
    const db = await SQLite.openDatabaseAsync("bible-app.db");

    console.log("📊 === DATABASE INFO ===");
    console.log("Database opened successfully");

    // Get table names
    const tables = await db.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    console.log(
      "Tables in database:",
      (tables as any[]).map((t) => t.name)
    );

    // Get row counts
    const userCount = await db.getFirstAsync(
      "SELECT COUNT(*) as count FROM users"
    );
    const verseCount = await db.getFirstAsync(
      "SELECT COUNT(*) as count FROM verses"
    );

    console.log("User count:", (userCount as any)?.count || 0);
    console.log("Verse count:", (verseCount as any)?.count || 0);

    console.log("📊 === END DATABASE INFO ===");
  } catch (error) {
    console.error("❌ Error getting database info:", error);
  }
}

// Function to clear all users (for testing authentication flow)
export async function clearAllUsers() {
  try {
    const db = await SQLite.openDatabaseAsync("bible-app.db");

    console.log("🗑️ Clearing all users...");

    await db.runAsync("DELETE FROM users");

    console.log("✅ All users cleared");
  } catch (error) {
    console.error("❌ Error clearing users:", error);
  }
}
