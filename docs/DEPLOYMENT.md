# Deployment Guide - Phase 1

## Overview
This guide covers deploying VoiceNotes Pro Phase 1 to both Android and iOS platforms.

## Prerequisites

### Development Environment
- **Node.js**: 18.0.0 or higher
- **React Native CLI**: Latest version
- **Android Studio**: Latest version (for Android builds)
- **Xcode**: 14.0+ (for iOS builds, macOS only)

### Platform-Specific Requirements

#### Android
- Android SDK 33+
- Build Tools 33.0.0+
- Java Development Kit (JDK) 11 or 17
- Android device or emulator with API level 23+ (Android 6.0+)

#### iOS
- macOS 12.0+ (Monterey)
- Xcode 14.0+
- iOS device or simulator running iOS 12.0+
- Apple Developer account (for device testing and App Store)

## Build Process

### Android Build

#### Debug Build (Development)
```bash
# Ensure Android emulator is running or device is connected
npm run android

# Or build APK manually
cd android
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

#### Release Build (Production)
```bash
# Generate release APK
cd android
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

#### Android App Bundle (for Play Store)
```bash
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### iOS Build

#### Debug Build (Development)
```bash
# Start Metro bundler
npm start

# Run on iOS simulator
npm run ios

# Or open in Xcode
open ios/VoiceNotesPro.xcworkspace
```

#### Release Build (Production)
1. Open `ios/VoiceNotesPro.xcworkspace` in Xcode
2. Select "Any iOS Device" or specific device
3. Change scheme to "Release"
4. Product → Archive
5. Follow Xcode organizer for distribution

## Environment Configuration

### Phase 1 Environment Setup
```bash
# Copy Phase 1 environment
cp .env.phase1 .env

# Verify configuration
cat .env
```

### Build Variants
Create different builds for testing vs production:

**Development** (`.env.development`):
```env
PHASE=1
APP_NAME=VoiceNotes Pro (Dev)
VERSION=1.0.0-dev
ENABLE_DEBUG_LOGGING=true
```

**Production** (`.env.production`):
```env
PHASE=1
APP_NAME=VoiceNotes Pro
VERSION=1.0.0
ENABLE_DEBUG_LOGGING=false
```

## Code Signing & Certificates

### Android
1. **Generate Keystore**:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore voicenotes-release.keystore -alias voicenotes -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure Gradle** (`android/app/build.gradle`):
```gradle
android {
    signingConfigs {
        release {
            storeFile file('voicenotes-release.keystore')
            storePassword 'YOUR_STORE_PASSWORD'
            keyAlias 'voicenotes'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
}
```

### iOS
1. **Apple Developer Account**: Required for device testing and App Store
2. **Provisioning Profiles**: Configure in Xcode project settings
3. **Certificates**: Download from Apple Developer portal

## Performance Optimization

### Bundle Size Optimization
```bash
# Analyze bundle size
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android-bundle.js --verbose

# Remove unused imports and dependencies
npm run lint
```

### Database Optimization
- SQLite database is automatically optimized for mobile
- Indexes are created for search functionality
- Regular cleanup of temporary files

### Memory Management
- Speech recognition listeners are properly cleaned up
- Image and audio resources are optimized
- Redux store is kept minimal for Phase 1

## Testing Before Deployment

### Automated Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Lint code
npm run lint
```

### Manual Testing Checklist

#### Core Features
- [ ] Create new note
- [ ] Edit existing note
- [ ] Delete note
- [ ] Speech-to-text recording
- [ ] Create/delete folders
- [ ] Move notes between folders
- [ ] Search notes
- [ ] App settings

#### Device Testing
- [ ] Test on multiple Android devices (different API levels)
- [ ] Test on multiple iOS devices (different iOS versions)
- [ ] Test microphone permissions
- [ ] Test speech recognition accuracy
- [ ] Test offline functionality
- [ ] Test app backgrounding/foregrounding

#### Performance Testing
- [ ] App startup time < 3 seconds
- [ ] Smooth scrolling with 100+ notes
- [ ] Speech recognition response time
- [ ] Database query performance

## Distribution

### Android Distribution Options

1. **Google Play Store**
   - Upload AAB file to Play Console
   - Complete store listing
   - Submit for review

2. **Direct APK Distribution**
   - Share APK file directly
   - Enable "Install from Unknown Sources"

3. **Internal Testing**
   - Use Firebase App Distribution
   - Share with beta testers

### iOS Distribution Options

1. **App Store**
   - Submit through Xcode or App Store Connect
   - Complete app metadata
   - Wait for review

2. **TestFlight** (Beta Testing)
   - Upload build to App Store Connect
   - Add beta testers
   - Distribute for testing

3. **Enterprise Distribution**
   - Requires Apple Developer Enterprise account
   - Internal distribution only

## Monitoring & Analytics

### Phase 1 Monitoring
- Local crash reporting (built into React Native)
- Performance monitoring through device logs
- User feedback collection (manual)

### Future Phases
- Firebase Analytics integration
- Crashlytics for crash reporting
- Performance monitoring tools

## Rollback Strategy

### Android
- Keep previous APK/AAB versions
- Play Store allows rollback to previous versions
- Direct distribution: provide previous APK

### iOS
- Keep previous IPA files
- App Store allows removing current version
- TestFlight maintains version history

## Security Considerations

### Phase 1 Security
- All data stored locally on device
- No external API calls (except speech recognition)
- Standard mobile app security practices

### Data Protection
- SQLite database uses device encryption
- No sensitive data transmitted
- Speech data processed locally when possible

## Troubleshooting Deployment Issues

### Common Build Errors

1. **Gradle Build Failed**:
```bash
cd android
./gradlew clean
./gradlew build
```

2. **iOS Build Failed**:
- Clean build folder in Xcode
- Delete `node_modules` and reinstall
- Update CocoaPods dependencies

3. **Metro Bundler Issues**:
```bash
npm start -- --reset-cache
```

### Platform-Specific Issues

**Android**:
- Check Android SDK path configuration
- Verify Java version compatibility
- Update build tools and target SDK

**iOS**:
- Check Xcode version compatibility
- Verify iOS deployment target
- Update iOS development certificates

## Next Phase Preparation

### Phase 2 Requirements
- Supabase account for cloud sync
- AI API keys (OpenAI, Claude, Gemini)
- Additional dependencies for cloud features

### Migration Strategy
- Phase 1 data will be migrated automatically
- Backward compatibility maintained
- Gradual feature rollout

## Support & Documentation

- **Development Guide**: See `DEVELOPMENT.md`
- **Phase Setup**: See individual phase documentation
- **API Documentation**: Coming in Phase 2
- **User Manual**: Coming with each phase release