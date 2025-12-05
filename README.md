# VoiceNotes Pro - Real-time Voice Transcription & AI-Powered Notes

A cross-platform mobile application for real-time voice transcription, AI-enhanced note-taking, and pronunciation learning.

## 🚀 Features Overview

- **Real-time Voice Transcription** - Convert speech to text with high accuracy
- **AI-Powered Text Enhancement** - Improve notes using Claude, GPT, Gemini APIs
- **Smart Organization** - Folders, collections, and diary-style notes
- **Pronunciation Analysis** - Voice analysis and IPA learning system
- **Offline Support** - Works without internet with local storage
- **Cross-Platform** - Android and iOS with shared codebase

## 📋 Development Phases

### Phase 1: Basic Note-taking + Speech-to-Text ✅
- Core note CRUD operations
- Real-time speech recognition
- Basic folder organization
- Local SQLite storage

### Phase 2: AI Text Enhancement + Advanced Organization 🔄
- AI API integrations (OpenAI, Claude, Gemini)
- Enhanced folder/collection system
- Markdown support
- Cloud sync with Supabase

### Phase 3: Diary Features + Collections 📅
- Daily diary entries
- Collection management
- Note references and linking
- Advanced search and filtering

### Phase 4: Pronunciation Analysis + IPA Learning 🎯
- Voice pronunciation scoring
- IPA sound teaching system
- Progress tracking
- Offline speech analysis

### Phase 5: NotebookLM Integration + Advanced Features 🤖
- NotebookLM API integration
- Graph-based note organization
- LanguageTool offline integration
- Advanced analytics

## 🛠️ Tech Stack

- **Frontend**: React Native + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Supabase (with SQLite offline)
- **State Management**: Redux Toolkit + RTK Query
- **Audio**: react-native-voice + react-native-sound
- **AI APIs**: OpenAI, Anthropic, Google APIs
- **Offline**: SQLite, LanguageTool, TensorFlow Lite

## 📖 Quick Start

Choose your development phase:

- [Phase 1 Setup](./docs/PHASE1_SETUP.md) - Basic functionality
- [Phase 2 Setup](./docs/PHASE2_SETUP.md) - AI enhancement
- [Phase 3 Setup](./docs/PHASE3_SETUP.md) - Diary & collections
- [Phase 4 Setup](./docs/PHASE4_SETUP.md) - Pronunciation features
- [Phase 5 Setup](./docs/PHASE5_SETUP.md) - Advanced features

## 🔧 Prerequisites

- Node.js 18+ and npm/yarn
- React Native development environment
- Android Studio (for Android)
- Xcode (for iOS, macOS only)
- Supabase account (Phase 2+)

## 📱 Platform Support

- **Android**: API level 23+ (Android 6.0+)
- **iOS**: iOS 12.0+

## 🤝 Contributing

Each phase is designed to be backward compatible. You can start with Phase 1 and gradually add features.

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.