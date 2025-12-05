import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  List,
  Text,
  Divider,
  Switch,
  Surface,
} from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';

import {theme, spacing} from '@/theme';

const SettingsScreen: React.FC = () => {
  const [speechEnabled, setSpeechEnabled] = React.useState(true);
  const [autoSave, setAutoSave] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleAbout = () => {
    Alert.alert(
      'About VoiceNotes Pro',
      `Version: 1.0.0 (Phase 1)\nBuild: ${DeviceInfo.getBuildNumber()}\n\nA real-time voice transcription and note-taking app.\n\nDeveloped with React Native`,
      [{text: 'OK'}]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      'Send Feedback',
      'Feature coming in Phase 2!\n\nWill include:\n• Email feedback\n• Bug reporting\n• Feature requests',
      [{text: 'OK'}]
    );
  };

  const handleExport = () => {
    Alert.alert(
      'Export Notes',
      'Export functionality coming in Phase 2!\n\nWill support:\n• PDF export\n• Text file export\n• Cloud backup',
      [{text: 'OK'}]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      'Privacy Policy',
      'Phase 1 Privacy Summary:\n\n• All notes stored locally on device\n• No data sent to external servers\n• Speech recognition uses device APIs\n• No tracking or analytics\n\nComplete privacy policy coming in Phase 2.',
      [{text: 'OK'}]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Speech Recognition
        </Text>
        
        <List.Item
          title="Enable Voice Input"
          description="Allow microphone access for voice transcription"
          left={props => <List.Icon {...props} icon="microphone" />}
          right={() => (
            <Switch
              value={speechEnabled}
              onValueChange={setSpeechEnabled}
            />
          )}
        />
        
        <Divider />
        
        <List.Item
          title="Language"
          description="English (US) - More languages in Phase 2"
          left={props => <List.Icon {...props} icon="translate" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => Alert.alert('Coming Soon', 'Multiple language support will be added in Phase 2')}
        />
      </Surface>

      <Surface style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Notes & Storage
        </Text>
        
        <List.Item
          title="Auto-Save"
          description="Automatically save notes while editing"
          left={props => <List.Icon {...props} icon="content-save-auto" />}
          right={() => (
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
            />
          )}
        />
        
        <Divider />
        
        <List.Item
          title="Storage Location"
          description="Local device storage (SQLite)"
          left={props => <List.Icon {...props} icon="database" />}
          right={props => <List.Icon {...props} icon="information" />}
          onPress={() => Alert.alert('Storage Info', 'Phase 1 stores all data locally on your device. Cloud sync will be available in Phase 2.')}
        />
        
        <Divider />
        
        <List.Item
          title="Export Notes"
          description="Export your notes to files"
          left={props => <List.Icon {...props} icon="export" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleExport}
        />
      </Surface>

      <Surface style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Appearance
        </Text>
        
        <List.Item
          title="Dark Mode"
          description="Coming in Phase 2"
          left={props => <List.Icon {...props} icon="brightness-6" />}
          right={() => (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              disabled={true}
            />
          )}
        />
      </Surface>

      <Surface style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Support & Info
        </Text>
        
        <List.Item
          title="Send Feedback"
          description="Report bugs or suggest features"
          left={props => <List.Icon {...props} icon="message-text" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleFeedback}
        />
        
        <Divider />
        
        <List.Item
          title="Privacy Policy"
          description="How we handle your data"
          left={props => <List.Icon {...props} icon="shield-account" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={handlePrivacy}
        />
        
        <Divider />
        
        <List.Item
          title="About"
          description="Version info and credits"
          left={props => <List.Icon {...props} icon="information" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleAbout}
        />
      </Surface>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.footerText}>
          VoiceNotes Pro • Phase 1
        </Text>
        <Text variant="bodySmall" style={styles.footerText}>
          More features coming in future phases
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    margin: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  footer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  footerText: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
});

export default SettingsScreen;