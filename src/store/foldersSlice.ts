import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Folder, CreateFolderRequest} from '@/types';
import * as DatabaseService from '@/services/database';

interface FoldersState {
  folders: Folder[];
  loading: boolean;
  error: string | null;
}

const initialState: FoldersState = {
  folders: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchFolders = createAsyncThunk(
  'folders/fetchFolders',
  async () => {
    return await DatabaseService.getFolders();
  }
);

export const createFolder = createAsyncThunk(
  'folders/createFolder',
  async (folderData: CreateFolderRequest) => {
    return await DatabaseService.createFolder(folderData);
  }
);

export const deleteFolder = createAsyncThunk(
  'folders/deleteFolder',
  async (id: string) => {
    await DatabaseService.deleteFolder(id);
    return id;
  }
);

const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch folders
      .addCase(fetchFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.loading = false;
        state.folders = action.payload;
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch folders';
      })
      
      // Create folder
      .addCase(createFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.loading = false;
        state.folders.push(action.payload);
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create folder';
      })
      
      // Delete folder
      .addCase(deleteFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.loading = false;
        state.folders = state.folders.filter(folder => folder.id !== action.payload);
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete folder';
      });
  },
});

export const {clearError} = foldersSlice.actions;
export default foldersSlice.reducer;