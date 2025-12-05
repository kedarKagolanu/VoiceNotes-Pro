import React, {useEffect, useState} from 'react';
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
  Dialog,
  Portal,
  TextInput,
  Button,
  Snackbar,
} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useAppDispatch} from '@/hooks/useAppDispatch';
import {useAppSelector} from '@/hooks/useAppSelector';
import {fetchFolders, createFolder, deleteFolder, clearError} from '@/store/foldersSlice';
import {fetchNotes} from '@/store/notesSlice';
import {Folder, RootStackParamList} from '@/types';
import {theme, spacing} from '@/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const FOLDER_COLORS = [
  '#007AFF', '#34C759', '#FF9500', '#FF3B30',
  '#AF52DE', '#FF2D92', '#5856D6', '#00C7BE',
];

const FoldersScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const {folders, loading, error} = useAppSelector(state => state.folders);
  const {notes} = useAppSelector(state => state.notes);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchFolders());
      dispatch(fetchNotes());
    }, [dispatch])
  );

  useEffect(() => {
    if (error) {
      setSnackbarVisible(true);
    }
  }, [error]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await dispatch(createFolder({
        name: newFolderName.trim(),
        color: selectedColor,
      })).unwrap();

      setNewFolderName('');
      setSelectedColor(FOLDER_COLORS[0]);
      setDialogVisible(false);
      dispatch(fetchFolders());
    } catch (err) {
      // Error handled by Redux state
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    if (folderId === 'default') {
      setSnackbarVisible(true);
      return;
    }

    dispatch(deleteFolder(folderId));
  };

  const getFolderNoteCount = (folderId: string) => {
    return notes.filter(note => note.folderId === folderId).length;
  };

  const onRefresh = () => {
    dispatch(fetchFolders());
    dispatch(fetchNotes());
  };

  const renderColorPicker = () => (
    <View style={styles.colorPicker}>
      <Text variant="labelMedium" style={styles.colorPickerLabel}>
        Choose color:
      </Text>
      <View style={styles.colorRow}>
        {FOLDER_COLORS.map(color => (
          <IconButton
            key={color}
            icon={selectedColor === color ? 'check' : undefined}
            iconColor={selectedColor === color ? 'white' : color}
            style={[styles.colorButton, {backgroundColor: color}]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>
    </View>
  );

  const renderFolderItem = ({item}: {item: Folder}) => {
    const noteCount = getFolderNoteCount(item.id);
    
    return (
      <Card style={styles.folderCard}>
        <Card.Content>
          <View style={styles.folderHeader}>
            <View style={styles.folderInfo}>
              <View style={[styles.folderIcon, {backgroundColor: item.color}]}>
                <IconButton icon="folder" iconColor="white" size={24} />
              </View>
              <View style={styles.folderDetails}>
                <Text variant="titleMedium" style={styles.folderName}>
                  {item.name}
                </Text>
                <Text variant="bodySmall" style={styles.folderCount}>
                  {noteCount} {noteCount === 1 ? 'note' : 'notes'}
                </Text>
              </View>
            </View>
            {item.id !== 'default' && (
              <IconButton
                icon="delete"
                iconColor={theme.colors.error}
                size={20}
                onPress={() => handleDeleteFolder(item.id)}
              />
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No folders yet
      </Text>
      <Text variant="bodyLarge" style={styles.emptySubtitle}>
        Create folders to organize your notes
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={folders}
        keyExtractor={item => item.id}
        renderItem={renderFolderItem}
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
        icon="folder-plus"
        style={styles.fab}
        onPress={() => setDialogVisible(true)}
        mode="elevated"
      />

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Create New Folder</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Folder name"
              value={newFolderName}
              onChangeText={setNewFolderName}
              mode="outlined"
              style={styles.folderNameInput}
              maxLength={50}
            />
            {renderColorPicker()}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button
              onPress={handleCreateFolder}
              disabled={!newFolderName.trim()}
              mode="contained"
            >
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

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
        {error || 'Cannot delete default folder'}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    padding: spacing.md,
    flexGrow: 1,
  },
  folderCard: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  folderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  folderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  folderIcon: {
    borderRadius: 8,
    marginRight: spacing.md,
  },
  folderDetails: {
    flex: 1,
  },
  folderName: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  folderCount: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
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
  folderNameInput: {
    marginBottom: spacing.md,
  },
  colorPicker: {
    marginTop: spacing.sm,
  },
  colorPickerLabel: {
    marginBottom: spacing.sm,
    color: theme.colors.onSurface,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorButton: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
});

export default FoldersScreen;