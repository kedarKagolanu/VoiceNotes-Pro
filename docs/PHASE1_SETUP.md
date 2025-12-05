# Phase 1: Basic Note-taking + Speech-to-Text

This phase implements the core functionality for note-taking with real-time speech recognition.

## 🎯 Phase 1 Features

- ✅ Basic note CRUD (Create, Read, Update, Delete)
- ✅ Real-time speech-to-text transcription
- ✅ Simple folder organization
- ✅ Local SQLite storage
- ✅ Cross-platform (Android/iOS)

## 📋 Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **React Native Development Environment**:
   - For Android: [Android Studio](https://developer.android.com/studio)
   - For iOS: [Xcode](https://developer.apple.com/xcode/) (macOS only)
3. **React Native CLI**: `npm install -g @react-native-community/cli`

## 🚀 Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Navigate to project root
cd VoiceNotesPro

# Install dependencies
npm install

# For iOS only (macOS required)
cd ios && pod install && cd ..
```

### 2. Environment Setup

Create environment file:

```bash
cp .env.example .env.phase1
```

Edit `.env.phase1`:
```env
# Phase 1 Configuration
PHASE=1
APP_NAME=VoiceNotes Pro
VERSION=1.0.0

# Speech Recognition (optional - uses device default)
SPEECH_TIMEOUT=5000
SPEECH_LANGUAGE=en-US
```

### 3. Database Setup (Local SQLite)

The app automatically creates local SQLite database on first run. No additional setup required.

### 4. Run the Application

#### Android
```bash
# Start Metro bundler
npm start

# Run on Android (in new terminal)
npm run android
```

#### iOS (macOS only)
```bash
# Start Metro bundler
npm start

# Run on iOS (in new terminal)
npm run ios
```

## 📱 Testing Phase 1

### Core Features to Test:

1. **Note Creation**:
   - Tap the "+" button to create a new note
   - Add title and content manually
   - Save the note

2. **Voice Transcription**:
   - Tap the microphone button in note editor
   - Speak clearly in English
   - Watch real-time transcription appear
   - Stop recording to finalize text

3. **Note Management**:
   - View all notes in the main list
   - Edit existing notes
   - Delete notes (swipe left or long press)
   - Search notes by title/content

4. **Basic Folders**:
   - Create folders from the main menu
   - Move notes to folders
   - Browse notes by folder

### Expected Performance:
- Speech recognition accuracy: 85-95% (depends on device and speech clarity)
- Note save/load: Instant (local storage)
- App startup time: < 2 seconds

## 🐛 Troubleshooting

### Android Issues:

**Microphone Permission Denied**:
```bash
# Add to android/app/src/main/AndroidManifest.xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

**Speech Recognition Not Working**:
- Ensure Google app is installed and updated
- Check device language settings
- Test with device's built-in voice recorder

### iOS Issues:

**Microphone Permission**:
- Check iOS Settings > Privacy & Security > Microphone
- Enable permission for VoiceNotes Pro

**Speech Recognition Issues**:
- Ensure iOS version is 12.0+
- Check Siri & Search settings
- Test with device's built-in voice memo app

### General Issues:

**Metro Bundle Error**:
```bash
# Clear cache and restart
npm start -- --reset-cache
```

**Build Failures**:
```bash
# Clean and rebuild
npm run clean
npm install
# For iOS: cd ios && pod install && cd ..
```

## 📊 Database Schema (Phase 1)

```sql
-- Notes table
CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    folder_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Folders table  
CREATE TABLE folders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#007AFF',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 Next Phase

Once Phase 1 is working correctly, you can proceed to [Phase 2](./PHASE2_SETUP.md) which adds:
- AI text enhancement
- Cloud synchronization
- Advanced folder management
- Markdown support

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review React Native documentation
3. Check device-specific requirements
4. Ensure all permissions are granted