// Phase 1 Types

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  folderId?: string;
}

export interface UpdateNoteRequest {
  id: string;
  title?: string;
  content?: string;
  folderId?: string;
}

export interface CreateFolderRequest {
  name: string;
  color?: string;
}

// Speech Recognition Types
export interface SpeechRecognitionResult {
  text: string;
  isFinal: boolean;
  confidence?: number;
}

export interface SpeechRecognitionError {
  message: string;
  code?: string;
}

// Navigation Types
export type RootStackParamList = {
  MainTabs: undefined;
  NoteEditor: {noteId?: string; folderId?: string};
  FolderSelector: {noteId?: string};
};

export type MainTabParamList = {
  Notes: undefined;
  Folders: undefined;
  Search: undefined;
  Settings: undefined;
};

// Redux State Types
export interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

export interface FoldersState {
  folders: Folder[];
  loading: boolean;
  error: string | null;
}

export interface RootState {
  notes: NotesState;
  folders: FoldersState;
}