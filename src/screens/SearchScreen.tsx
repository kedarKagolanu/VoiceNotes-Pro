import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import {
  Searchbar,
  Text,
  Card,
  IconButton,
} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useAppDispatch} from '@/hooks/useAppDispatch';
import {useAppSelector} from '@/hooks/useAppSelector';
import {searchNotes} from '@/store/notesSlice';
import {fetchFolders} from '@/store/foldersSlice';
import {Note, RootStackParamList} from '@/types';
import {theme, spacing} from '@/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const {notes, loading} = useAppSelector(state => state.notes);
  const {folders} = useAppSelector(state => state.folders);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Note[]>([]);

  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    try {
      const results = await dispatch(searchNotes(query)).unwrap();
      setSearchResults(results);
    } catch (error) {
      setSearchResults([]);
    }
  };

  const handleEditNote = (noteId: string) => {
    navigation.navigate('NoteEditor', {noteId});
  };

  const highlightSearchTerm = (text: string, term: string) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '**$1**');
  };

  const renderSearchResult = ({item}: {item: Note}) => {
    const folder = folders.find(f => f.id === item.folderId);
    
    return (
      <Card style={styles.resultCard} onPress={() => handleEditNote(item.id)}>
        <Card.Content>
          <View style={styles.resultHeader}>
            <Text variant="titleMedium" style={styles.resultTitle}>
              {item.title || 'Untitled Note'}
            </Text>
            <IconButton
              icon="open-in-new"
              size={20}
              onPress={() => handleEditNote(item.id)}
            />
          </View>
          
          {item.content && (
            <Text
              variant="bodyMedium"
              numberOfLines={3}
              style={styles.resultContent}
            >
              {item.content}
            </Text>
          )}
          
          <View style={styles.resultFooter}>
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

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            Searching...
          </Text>
        </View>
      );
    }

    if (searchQuery.trim() && searchResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No results found
          </Text>
          <Text variant="bodyLarge" style={styles.emptySubtitle}>
            Try different keywords or check spelling
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          Search your notes
        </Text>
        <Text variant="bodyLarge" style={styles.emptySubtitle}>
          Enter keywords to find notes by title or content
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search notes..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.searchInput}
          loading={loading}
        />
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={item => item.id}
        renderItem={renderSearchResult}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: theme.colors.surface,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: theme.colors.surfaceVariant,
  },
  searchInput: {
    color: theme.colors.onSurface,
  },
  listContainer: {
    padding: spacing.md,
    flexGrow: 1,
  },
  resultCard: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  resultTitle: {
    flex: 1,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  resultContent: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
  resultFooter: {
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
  emptyText: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
});

export default SearchScreen;