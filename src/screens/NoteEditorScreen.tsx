import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Keyboard,
} from 'react-native';
import {
  Appbar,
  FAB,
  Text,
  Snackbar,
  ActivityIndicator,
  IconButton,
  Surface,
} from 'react-native-paper';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useAppDispatch} from '@/hooks/useAppDispatch';
import {useAppSelector} from '@/hooks/useAppSelector';
import {createNote, updateNote, clearError} from '@/store/notesSlice';
import {fetchNotes} from '@/store/notesSlice';
import {speechRecognition} from '@/services/speechRecognition';
import {RootStackParamList, Note, SpeechRecognitionResult, SpeechRecognitionError} from '@/types';
import {theme, spacing} from '@/theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'NoteEditor'>;
type RouteProp = RouteProp<RootStackParamList, 'NoteEditor'>;

const NoteEditorScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp>();
  const dispatch = useAppDispatch();
  const {notes, loading, error} = useAppSelector(state => state.notes);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const contentInputRef = useRef<TextInput>(null);
  const initialContentRef = useRef('');
  const initialTitleRef = useRef('');

  const {noteId, folderId} = route.params || {};
  const isEditing = !!noteId;

  useEffect(() => {
    if (isEditing && noteId) {
      const note = notes.find((n: Note) => n.id === noteId);
      if (note) {
        setTitle(note.title);
        setContent(note.content || '');
        initialTitleRef.current = note.title;
        initialContentRef.current = note.content || '';
      }
    }

    // Setup speech recognition callbacks
    speechRecognition.setOnResult(handleSpeechResult);
    speechRecognition.setOnError(handleSpeechError);
    speechRecognition.setOnStart(() => setIsListening(true));
    speechRecognition.setOnEnd(() => setIsListening(false));

    return () => {
      speechRecognition.stopListening();
    };
  }, [isEditing, noteId, notes]);

  useEffect(() => {
    // Check for unsaved changes
    const titleChanged = title !== initialTitleRef.current;
    const contentChanged = content !== initialContentRef.current;
    setHasUnsavedChanges(titleChanged || contentChanged);
  }, [title, content]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarVisible(true);
    }
  }, [error]);

  const handleSpeechResult = (result: SpeechRecognitionResult) => {
    if (result.isFinal) {
      // Add final speech result to content
      const newContent = content + (content ? ' ' : '') + result.text;
      setContent(newContent);
      setSpeechText('');
    } else {
      // Show partial results
      setSpeechText(result.text);
    }
  };

  const handleSpeechError = (error: SpeechRecognitionError) => {
    setIsListening(false);
    setSnackbarMessage(`Speech recognition error: ${error.message}`);
    setSnackbarVisible(true);
  };

  const toggleSpeechRecognition = async () => {
    try {
      if (isListening) {
        await speechRecognition.stopListening();
      } else {
        // Check if speech recognition is available
        const isAvailable = await speechRecognition.isAvailable();
        if (!isAvailable) {
          setSnackbarMessage('Speech recognition is not available on this device');
          setSnackbarVisible(true);
          return;
        }

        // Focus on content input and dismiss keyboard
        contentInputRef.current?.focus();
        Keyboard.dismiss();

        await speechRecognition.startListening({
          language: 'en-US',
          partialResults: true,
        });
      }
    } catch (err) {
      setSnackbarMessage('Failed to start speech recognition');
      setSnackbarVisible(true);
    }
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      setSnackbarMessage('Please add a title or content before saving');
      setSnackbarVisible(true);
      return;
    }

    const noteTitle = title.trim() || 'Untitled Note';

    try {
      if (isEditing && noteId) {
        await dispatch(updateNote({
          id: noteId,
          title: noteTitle,
          content: content.trim(),
        })).unwrap();
      } else {
        await dispatch(createNote({
          title: noteTitle,
          content: content.trim(),
          folderId,
        })).unwrap();
      }

      // Refresh notes list
      dispatch(fetchNotes());
      navigation.goBack();
    } catch (err) {
      setSnackbarMessage('Failed to save note');
      setSnackbarVisible(true);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save them before leaving?',
        [
          {text: 'Discard', style: 'destructive', onPress: () => navigation.goBack()},
          {text: 'Cancel', style: 'cancel'},
          {text: 'Save', onPress: handleSave},
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const displayContent = content + (speechText ? ` ${speechText}` : '');

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title={isEditing ? 'Edit Note' : 'New Note'} />
        <Appbar.Action 
          icon="content-save" 
          onPress={handleSave}
          disabled={loading}
        />
      </Appbar.Header>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.titleInput}
          placeholder="Note title..."
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          maxLength={100}
        />

        <View style={styles.separator} />

        <TextInput
          ref={contentInputRef}
          style={styles.contentInput}
          placeholder="Start typing or use voice recognition..."
          value={displayContent}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />

        {isListening && (
          <Surface style={styles.listeningIndicator}>
            <View style={styles.listeningContent}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.listeningText}>
                Listening... Speak now
              </Text>
            </View>
            {speechText && (
              <Text variant="bodySmall" style={styles.speechPreview}>
                "{speechText}"
              </Text>
            )}
          </Surface>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <IconButton
          icon="folder"
          mode="outlined"
          onPress={() => navigation.navigate('FolderSelector', {noteId})}
        />
        
        <FAB
          icon={isListening ? 'stop' : 'microphone'}
          mode={isListening ? 'elevated' : 'elevated'}
          style={[
            styles.speechFab,
            isListening && styles.speechFabListening,
          ]}
          onPress={toggleSpeechRecognition}
          loading={isListening}
          disabled={loading}
        />

        <IconButton
          icon="text-to-speech"
          mode="outlined"
          onPress={() => {
            setSnackbarMessage('Text-to-speech feature coming in Phase 2!');
            setSnackbarVisible(true);
          }}
        />
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => {
          setSnackbarVisible(false);
          dispatch(clearError());
        }}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => {
            setSnackbarVisible(false);
            dispatch(clearError());
          },
        }}
      >
        {snackbarMessage}
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
    backgroundColor: theme.colors.surface,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: spacing.md,
    textAlignVertical: 'top',
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.outline,
    marginBottom: spacing.md,
  },
  contentInput: {
    fontSize: 16,
    color: theme.colors.onSurface,
    lineHeight: 24,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  listeningIndicator: {
    padding: spacing.md,
    marginTop: spacing.md,
    borderRadius: 8,
    backgroundColor: theme.colors.primaryContainer,
  },
  listeningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  listeningText: {
    marginLeft: spacing.sm,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  speechPreview: {
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  speechFab: {
    backgroundColor: theme.colors.secondary,
  },
  speechFabListening: {
    backgroundColor: theme.colors.error,
  },
});

export default NoteEditorScreen;