import AsyncStorage from '@react-native-async-storage/async-storage';
import {Note, Folder} from '@/types';

// Using AsyncStorage instead of SQLite for better compatibility
const NOTES_KEY = 'voicenotes_notes';
const FOLDERS_KEY = 'voicenotes_folders';

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Initialize default folder if it doesn't exist
    const folders = await getFolders();
    if (folders.length === 0) {
      await createFolder({
        name: 'Default',
        color: '#007AFF',
      });
    }
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

// Notes CRUD Operations
export const createNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
  try {
    const id = generateId();
    const now = new Date();
    
    const newNote: Note = {
      id,
      title: note.title,
      content: note.content,
      folderId: note.folderId,
      createdAt: now,
      updatedAt: now,
    };

    const notes = await getNotes();
    notes.unshift(newNote);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    
    return newNote;
  } catch (error) {
    console.error('Failed to create note:', error);
    throw error;
  }
};

export const getNotes = async (folderId?: string): Promise<Note[]> => {
  try {
    const notesJson = await AsyncStorage.getItem(NOTES_KEY);
    let notes: Note[] = [];
    
    if (notesJson) {
      const parsedNotes = JSON.parse(notesJson);
      notes = parsedNotes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    }

    if (folderId) {
      notes = notes.filter(note => note.folderId === folderId);
    }

    return notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  } catch (error) {
    console.error('Failed to get notes:', error);
    return [];
  }
};

export const getNoteById = async (id: string): Promise<Note | null> => {
  try {
    const notes = await getNotes();
    return notes.find(note => note.id === id) || null;
  } catch (error) {
    console.error('Failed to get note by id:', error);
    return null;
  }
};

export const updateNote = async (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Note> => {
  try {
    const notes = await getNotes();
    const noteIndex = notes.findIndex(note => note.id === id);
    
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }

    const updatedNote = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date(),
    };

    notes[noteIndex] = updatedNote;
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    
    return updatedNote;
  } catch (error) {
    console.error('Failed to update note:', error);
    throw error;
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  try {
    const notes = await getNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(filteredNotes));
  } catch (error) {
    console.error('Failed to delete note:', error);
    throw error;
  }
};

// Folders CRUD Operations
export const createFolder = async (folder: Omit<Folder, 'id' | 'createdAt'>): Promise<Folder> => {
  try {
    const id = folder.name === 'Default' ? 'default' : generateId();
    const now = new Date();
    
    const newFolder: Folder = {
      id,
      name: folder.name,
      color: folder.color || '#007AFF',
      createdAt: now,
    };

    const folders = await getFolders();
    folders.push(newFolder);
    await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
    
    return newFolder;
  } catch (error) {
    console.error('Failed to create folder:', error);
    throw error;
  }
};

export const getFolders = async (): Promise<Folder[]> => {
  try {
    const foldersJson = await AsyncStorage.getItem(FOLDERS_KEY);
    let folders: Folder[] = [];
    
    if (foldersJson) {
      const parsedFolders = JSON.parse(foldersJson);
      folders = parsedFolders.map((folder: any) => ({
        ...folder,
        createdAt: new Date(folder.createdAt),
      }));
    }

    return folders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  } catch (error) {
    console.error('Failed to get folders:', error);
    return [];
  }
};

export const deleteFolder = async (id: string): Promise<void> => {
  try {
    if (id === 'default') {
      throw new Error('Cannot delete default folder');
    }

    // Move notes in this folder to default folder
    const notes = await getNotes();
    const updatedNotes = notes.map(note => 
      note.folderId === id ? { ...note, folderId: 'default' } : note
    );
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));

    // Delete the folder
    const folders = await getFolders();
    const filteredFolders = folders.filter(folder => folder.id !== id);
    await AsyncStorage.setItem(FOLDERS_KEY, JSON.stringify(filteredFolders));
  } catch (error) {
    console.error('Failed to delete folder:', error);
    throw error;
  }
};

// Search functionality
export const searchNotes = async (query: string): Promise<Note[]> => {
  try {
    const notes = await getNotes();
    const lowercaseQuery = query.toLowerCase();
    
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      (note.content && note.content.toLowerCase().includes(lowercaseQuery))
    );
  } catch (error) {
    console.error('Failed to search notes:', error);
    return [];
  }
};

// Utility functions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const closeDatabase = async (): Promise<void> => {
  // No cleanup needed for AsyncStorage
  console.log('Database connection closed');
};