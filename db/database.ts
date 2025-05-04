import * as SQLite from 'expo-sqlite';

// Using the new API method openDatabaseAsync instead of openDatabase/openDatabaseSync
const db = SQLite.openDatabaseAsync('passcode.db');

export async function initDB() {
  const database = await db;
  // Use execAsync for creating the table
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS passwords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination TEXT,
      user TEXT,
      password TEXT,
      notes TEXT
    );
  `);
}

export async function addEntry(destination: string, user: string, password: string, notes: string, callback: () => void) {
  const database = await db;
  try {
    // Use runAsync for INSERT operations
    await database.runAsync(
      'INSERT INTO passwords (destination, user, password, notes) VALUES (?, ?, ?, ?);',
      [destination, user, password, notes]
    );
    callback();
  } catch (error) {
    console.error("Insert error:", error);
  }
}

export async function updateEntry(id: number, destination: string, user: string, password: string, notes: string, callback: () => void) {
  const database = await db;
  try {
    await database.runAsync(
      'UPDATE passwords SET destination = ?, user = ?, password = ?, notes = ? WHERE id = ?;',
      [destination, user, password, notes, id]
    );
    callback();
  } catch (error) {
    console.error("Update error:", error);
  }
}

export async function deleteEntry(id: number, callback: () => void) {
  const database = await db;
  try {
    await database.runAsync('DELETE FROM passwords WHERE id = ?;', [id]);
    callback();
  } catch (error) {
    console.error("Delete error:", error);
  }
}

export async function fetchEntries(callback: (entries: any[]) => void) {
  const database = await db;
  try {
    // Use getAllAsync for SELECT operations
    const results = await database.getAllAsync('SELECT * FROM passwords;');
    callback(results);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
