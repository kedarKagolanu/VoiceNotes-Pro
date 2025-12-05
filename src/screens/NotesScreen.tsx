import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  FAB,
  Text,
  Card,
  IconButton,
  Snackbar,
  Menu,
  Divider,
} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useAppDispatch} from '@/hooks/useAppDispatch';
import {useAppSelector} from '@/hooks/useAppSelector';
import {fetchNotes, deleteNote, clearError} from '@/store/notesSlice';
import {fetchFolders} from '@/store/foldersSlice';
import {Note, RootStackParamList} from '@/types';
import {theme, spacing} from '@/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const NotesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const {notes, loading, error} = useAppSelector(state => state.notes);
  const {folders} = useAppSelector(state => state.folders);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchNotes(selectedFolderId));
      dispatch(fetchFolders());
    }, [dispatch, selectedFolderId])
  );

  useEffect(() => {
    if (error) {
      setSnackbarVisible(true);
    }
  }, [error]);

  const filteredNotes = useMemo(() => {
    if (!selectedFolderId) return notes;
    return notes.filter(note => note.folderId === selectedFolderId);
  }, [notes, selectedFolderId]);

  const selectedFolder = useMemo(() => {
    return folders.find(folder => folder.id === selectedFolderId);
  }, [folders, selectedFolderId]);

  const handleCreateNote = () => {
    navigation.navigate('NoteEditor', {folderId: selectedFolderId});
  };

  const handleEditNote = (noteId: string) => {
    navigation.navigate('NoteEditor', {noteId});
  };

  const handleDeleteNote = (noteId: string) => {
    dispatch(deleteNote(noteId));
  };

  const onRefresh = () => {
    dispatch(fetchNotes(selectedFolderId));
  };

  const renderNoteItem = ({item}: {item: Note}) => {
    const folder = folders.find(f => f.id === item.folderId);
    
    return (
      <Card style={styles.noteCard} onPress={() => handleEditNote(item.id)}>
        <Card.Content>
          <View style={styles.noteHeader}>
            <Text variant="titleMedium" style={styles.noteTitle}>
              {item.title || 'Untitled Note'}
            </Text>
            <IconButton
              icon="delete"
              iconColor={theme.colors.error}
              size={20}
              onPress={() => handleDeleteNote(item.id)}
            />
          </View>
          
          {item.content && (
            <Text
              variant="bodyMedium"
              numberOfLines={3}
              style={styles.noteContent}
            >
              {item.content}
            </Text>
          )}
          
          <View style={styles.noteFooter}>
            {folder && (
              <View style={[styles.folderTag, {backgroundColor: folder.color}]}>
                <Text variant="labelSmall" style={styles.folderText}>
                  {folder.name}
                </Text>
              </View>
            )}
            <Text variant="bodySmall" style={styles.dateText}>
              {item.updatedAt.toLocaleDateString()}
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No notes yet
      </Text>
      <Text variant="bodyLarge" style={styles.emptySubtitle}>
        Tap the + button to create your first note
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">
          {selectedFolder ? selectedFolder.name : 'All Notes'}
        </Text>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="filter-list"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setSelectedFolderId(undefined);
              setMenuVisible(false);
            }}
            title="All Notes"
            leadingIcon="note"
          />
          <Divider />
          {folders.map(folder => (
            <Menu.Item
              key={folder.id}
              onPress={() => {
                setSelectedFolderId(folder.id);
                setMenuVisible(false);
              }}
              title={folder.name}
              leadingIcon="folder"
            />
          ))}
        </Menu>
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        renderItem={renderNoteItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="add"
        style={styles.fab}
        onPress={handleCreateNote}
        mode="elevated"
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => {
          setSnackbarVisible(false);
          dispatch(clearError());
        }}
        duration={4000}
        action={{
          label: 'Dismiss',
          onPress: () => {
            setSnackbarVisible(false);
            dispatch(clearError());
          },
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  listContainer: {
    padding: spacing.md,
    flexGrow: 1,
  },
  noteCard: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  noteTitle: {
    flex: 1,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  noteContent: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  folderTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  folderText: {
    color: 'white',
    fontWeight: '500',
  },
  dateText: {
    color: theme.colors.onSurfaceVariant,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: spacing.sm,
    color: theme.colors.onSurface,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default NotesScreen;