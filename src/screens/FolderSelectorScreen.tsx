import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  Appbar,
  List,
  Text,
  RadioButton,
  Surface,
} from 'react-native-paper';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useAppDispatch} from '@/hooks/useAppDispatch';
import {useAppSelector} from '@/hooks/useAppSelector';
import {fetchFolders} from '@/store/foldersSlice';
import {updateNote} from '@/store/notesSlice';
import {RootStackParamList, Folder} from '@/types';
import {theme, spacing} from '@/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'FolderSelector'>;
type RouteProp = RouteProp<RootStackParamList, 'FolderSelector'>;

const FolderSelectorScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const dispatch = useAppDispatch();
  const {folders} = useAppSelector(state => state.folders);
  const {notes} = useAppSelector(state => state.notes);

  const {noteId} = route.params || {};
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');

  useEffect(() => {
    dispatch(fetchFolders());
    
    if (noteId) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setSelectedFolderId(note.folderId || 'default');
      }
    }
  }, [dispatch, noteId, notes]);

  const handleSelectFolder = async (folderId: string) => {
    setSelectedFolderId(folderId);
    
    if (noteId) {
      try {
        await dispatch(updateNote({
          id: noteId,
          folderId: folderId === 'default' ? undefined : folderId,
        })).unwrap();
        
        navigation.goBack();
      } catch (error) {
        // Error handled by Redux state
      }
    }
  };

  const renderFolderItem = ({item}: {item: Folder}) => (
    <Surface style={styles.folderItem}>
      <List.Item
        title={item.name}
        description={`${getFolderNoteCount(item.id)} notes`}
        left={() => (
          <View style={[styles.folderIcon, {backgroundColor: item.color}]}>
            <List.Icon icon="folder" color="white" />
          </View>
        )}
        right={() => (
          <RadioButton
            value={item.id}
            status={selectedFolderId === item.id ? 'checked' : 'unchecked'}
            onPress={() => handleSelectFolder(item.id)}
          />
        )}
        onPress={() => handleSelectFolder(item.id)}
      />
    </Surface>
  );

  const getFolderNoteCount = (folderId: string) => {
    return notes.filter(note => note.folderId === folderId).length;
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Select Folder" />
      </Appbar.Header>

      <FlatList
        data={folders}
        keyExtractor={item => item.id}
        renderItem={renderFolderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
  },
  listContainer: {
    padding: spacing.md,
  },
  folderItem: {
    borderRadius: 8,
    elevation: 1,
    marginBottom: spacing.sm,
  },
  folderIcon: {
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  separator: {
    height: spacing.sm,
  },
});

export default FolderSelectorScreen;