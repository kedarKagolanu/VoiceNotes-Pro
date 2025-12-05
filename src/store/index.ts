import {configureStore} from '@reduxjs/toolkit';
import notesReducer from './notesSlice';
import foldersReducer from './foldersSlice';

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    folders: foldersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['payload.createdAt', 'payload.updatedAt'],
        // Ignore these paths in the state
        ignoredStatePaths: ['notes.notes', 'folders.folders'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;