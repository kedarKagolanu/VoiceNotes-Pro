# Development Guide

## Project Structure

```
VoiceNotesPro/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/             # Screen components
│   ├── navigation/          # Navigation configuration
│   ├── services/            # Business logic & API calls
│   ├── store/              # Redux store & slices
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── theme/              # Theme configuration
│   └── utils/              # Utility functions
├── android/                # Android-specific code
├── ios/                    # iOS-specific code
├── docs/                   # Documentation
└── __tests__/             # Test files
```

## Key Technologies

- **React Native 0.72.6**: Cross-platform mobile framework
- **TypeScript**: Type safety and better development experience
- **Redux Toolkit**: State management with RTK Query
- **React Native Paper**: Material Design components
- **React Navigation 6**: Navigation library
- **SQLite**: Local database storage
- **React Native Voice**: Speech recognition

## Development Workflow

### 1. Environment Setup
```bash
# Install dependencies
npm install

# iOS only (requires macOS)
cd ios && pod install && cd ..
```

### 2. Running the App
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

### 3. Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### 4. Linting & Code Quality
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## Phase Development Guidelines

### Phase 1: Core Features
- ✅ Basic note CRUD operations
- ✅ Speech-to-text transcription
- ✅ Local SQLite storage
- ✅ Basic folder organization
- ✅ Search functionality

### Adding New Features

1. **Define Types**: Add interfaces to `src/types/index.ts`
2. **Create Services**: Add business logic to `src/services/`
3. **Update Store**: Add Redux slices in `src/store/`
4. **Build UI**: Create screens/components
5. **Add Navigation**: Update navigation configuration
6. **Write Tests**: Add unit and integration tests
7. **Update Documentation**: Document new features

## Code Style Guidelines

### TypeScript
- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use proper typing for Redux actions and state

### React Native
- Use functional components with hooks
- Follow React Native best practices
- Implement proper error handling

### Redux
- Use Redux Toolkit for state management
- Keep state normalized
- Handle async operations with createAsyncThunk

### File Naming
- Components: PascalCase (e.g., `NoteEditor.tsx`)
- Services: camelCase (e.g., `speechRecognition.ts`)
- Types: PascalCase interfaces (e.g., `Note`, `Folder`)

## Database Schema

### Notes Table
```sql
CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    folder_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (folder_id) REFERENCES folders (id)
);
```

### Folders Table
```sql
CREATE TABLE folders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#007AFF',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Performance Considerations

1. **Database**: Use SQLite for fast local queries
2. **Lists**: Implement FlatList for large note collections
3. **Speech**: Debounce speech recognition results
4. **Memory**: Clean up speech recognition listeners
5. **Navigation**: Use native stack for better performance

## Testing Strategy

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test Redux store interactions
3. **E2E Tests**: Test complete user workflows
4. **Manual Testing**: Test on real devices for speech recognition

## Troubleshooting

### Common Issues

1. **Metro Bundle Errors**: Clear cache with `npm start -- --reset-cache`
2. **Permission Denied**: Check microphone permissions in device settings
3. **Speech Recognition**: Ensure device language matches app language
4. **Build Failures**: Clean and rebuild, update dependencies

### Platform-Specific Issues

**Android**:
- Ensure Google app is installed for speech recognition
- Check Android API level compatibility (min API 23)

**iOS**:
- Verify Xcode version compatibility
- Check iOS deployment target (min iOS 12.0)
- Ensure proper provisioning profiles for device testing

## Contributing

1. Create feature branch from main
2. Follow coding standards
3. Write tests for new features
4. Update documentation
5. Submit pull request with clear description

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [React Native Paper Documentation](https://reactnativepaper.com/)