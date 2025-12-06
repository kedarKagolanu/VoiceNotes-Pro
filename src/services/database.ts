import SQLite from 'react-native-sqlite-2';
import {Note, Folder} from '@/types';

let database: any = null;

export const initializeDatabase = async (): Promise<void> => {
  try {
    database = SQLite.openDatabase('voicenotes.db', '1.0', 'VoiceNotes Pro Database', 200000);
    
    await createTables();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

const createTables = async (): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  // Create folders table
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS folders (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT DEFAULT '#007AFF',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create notes table
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      folder_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (folder_id) REFERENCES folders (id) ON DELETE SET NULL
    );
  `);

  // Create default folder if not exists
  const [result] = await database.executeSql(
    'SELECT COUNT(*) as count FROM folders WHERE name = ?',
    ['Default']
  );

  if (result.rows.item(0).count === 0) {
    await database.executeSql(
      'INSERT INTO folders (id, name, color) VALUES (?, ?, ?)',
      ['default', 'Default', '#007AFF']
    );
  }
};

// Notes CRUD Operations
export const createNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
  if (!database) throw new Error('Database not initialized');

  const id = generateId();
  const now = new Date().toISOString();

  await database.executeSql(
    'INSERT INTO notes (id, title, content, folder_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, note.title, note.content, note.folderId || null, now, now]
  );

  return {
    id,
    title: note.title,
    content: note.content,
    folderId: note.folderId,
    createdAt: new Date(now),
    updatedAt: new Date(now),
  };
};

export const getNotes = async (folderId?: string): Promise<Note[]> => {
  if (!database) throw new Error('Database not initialized');

  let query = 'SELECT * FROM notes';
  let params: any[] = [];

  if (folderId) {
    query += ' WHERE folder_id = ?';
    params.push(folderId);
  }

  query += ' ORDER BY updated_at DESC';

  const [result] = await database.executeSql(query, params);
  const notes: Note[] = [];

  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);
    notes.push({
      id: row.id,
      title: row.title,
      content: row.content,
      folderId: row.folder_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  return notes;
};

export const getNoteById = async (id: string): Promise<Note | null> => {
  if (!database) throw new Error('Database not initialized');

  const [result] = await database.executeSql(
    'SELECT * FROM notes WHERE id = ?',
    [id]
  );

  if (result.rows.length === 0) return null;

  const row = result.rows.item(0);
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    folderId: row.folder_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
};

export const updateNote = async (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Note> => {
  if (!database) throw new Error('Database not initialized');

  const setClause = [];
  const params = [];

  if (updates.title !== undefined) {
    setClause.push('title = ?');
    params.push(updates.title);
  }
  if (updates.content !== undefined) {
    setClause.push('content = ?');
    params.push(updates.content);
  }
  if (updates.folderId !== undefined) {
    setClause.push('folder_id = ?');
    params.push(updates.folderId);
  }

  if (setClause.length === 0) {
    throw new Error('No updates provided');
  }

  const now = new Date().toISOString();
  setClause.push('updated_at = ?');
  params.push(now, id);

  await database.executeSql(
    `UPDATE notes SET ${setClause.join(', ')} WHERE id = ?`,
    params
  );

  const updatedNote = await getNoteById(id);
  if (!updatedNote) throw new Error('Note not found after update');
  
  return updatedNote;
};

export const deleteNote = async (id: string): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  await database.executeSql('DELETE FROM notes WHERE id = ?', [id]);
};

// Folders CRUD Operations
export const createFolder = async (folder: Omit<Folder, 'id' | 'createdAt'>): Promise<Folder> => {
  if (!database) throw new Error('Database not initialized');

  const id = generateId();
  const now = new Date().toISOString();

  await database.executeSql(
    'INSERT INTO folders (id, name, color, created_at) VALUES (?, ?, ?, ?)',
    [id, folder.name, folder.color || '#007AFF', now]
  );

  return {
    id,
    name: folder.name,
    color: folder.color || '#007AFF',
    createdAt: new Date(now),
  };
};

export const getFolders = async (): Promise<Folder[]> => {
  if (!database) throw new Error('Database not initialized');

  const [result] = await database.executeSql(
    'SELECT * FROM folders ORDER BY created_at ASC'
  );
  
  const folders: Folder[] = [];

  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);
    folders.push({
      id: row.id,
      name: row.name,
      color: row.color,
      createdAt: new Date(row.created_at),
    });
  }

  return folders;
};

export const deleteFolder = async (id: string): Promise<void> => {
  if (!database) throw new Error('Database not initialized');

  // Move notes in this folder to default folder
  await database.executeSql(
    'UPDATE notes SET folder_id = ? WHERE folder_id = ?',
    ['default', id]
  );

  // Delete the folder (but not the default folder)
  if (id !== 'default') {
    await database.executeSql('DELETE FROM folders WHERE id = ?', [id]);
  }
};

// Search functionality
export const searchNotes = async (query: string): Promise<Note[]> => {
  if (!database) throw new Error('Database not initialized');

  const [result] = await database.executeSql(
    'SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC',
    [`%${query}%`, `%${query}%`]
  );

  const notes: Note[] = [];

  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);
    notes.push({
      id: row.id,
      title: row.title,
      content: row.content,
      folderId: row.folder_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  return notes;
};

// Utility functions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const closeDatabase = async (): Promise<void> => {
  if (database) {
    await database.close();
    database = null;
    console.log('Database closed');
  }
};