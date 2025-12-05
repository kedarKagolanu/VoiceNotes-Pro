import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {Note, CreateNoteRequest, UpdateNoteRequest} from '@/types';
import * as DatabaseService from '@/services/database';

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async (folderId?: string) => {
    return await DatabaseService.getNotes(folderId);
  }
);

export const createNote = createAsyncThunk(
  'notes/createNote',
  async (noteData: CreateNoteRequest) => {
    return await DatabaseService.createNote(noteData);
  }
);

export const updateNote = createAsyncThunk(
  'notes/updateNote',
  async (noteData: UpdateNoteRequest) => {
    const {id, ...updates} = noteData;
    return await DatabaseService.updateNote(id, updates);
  }
);

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async (id: string) => {
    await DatabaseService.deleteNote(id);
    return id;
  }
);

export const searchNotes = createAsyncThunk(
  'notes/searchNotes',
  async (query: string) => {
    return await DatabaseService.searchNotes(query);
  }
);

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch notes';
      })
      
      // Create note
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.unshift(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create note';
      })
      
      // Update note
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex(note => note.id === action.payload.id);
        if (index !== -1) {
          state.notes[index] = action.payload;
          // Move updated note to top
          const updatedNote = state.notes.splice(index, 1)[0];
          state.notes.unshift(updatedNote);
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update note';
      })
      
      // Delete note
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = state.notes.filter(note => note.id !== action.payload);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete note';
      })
      
      // Search notes
      .addCase(searchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(searchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search notes';
      });
  },
});

export const {clearError, setNotes} = notesSlice.actions;
export default notesSlice.reducer;