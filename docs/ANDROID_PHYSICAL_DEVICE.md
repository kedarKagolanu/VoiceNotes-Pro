# Android Physical Device Setup & Testing

Quick guide to connect your Android phone and run VoiceNotes Pro directly on it.

## 🔌 Setup Your Android Phone

### 1. Enable Developer Mode
1. Open **Settings** on your phone
2. Go to **About phone** (or **About device**)
3. Find **Build number**
4. Tap **Build number** 7 times rapidly
5. You'll see "You are now a developer!" message

### 2. Enable USB Debugging
1. Go back to main **Settings**
2. Look for **Developer options** (usually under System or Advanced)
3. Toggle **USB debugging** to **ON**
4. Also enable **Stay awake** (optional - keeps screen on while charging)

## 🖥️ Setup Your Computer

### Windows
1. **Install Android Studio** or **ADB Tools**:
   - Download from: https://developer.android.com/studio
   - Or minimal ADB: https://developer.android.com/studio/releases/platform-tools

2. **Add ADB to PATH**:
   - Extract platform-tools to `C:\platform-tools`
   - Add `C:\platform-tools` to Windows PATH environment variable

### macOS
```bash
# Install via Homebrew (recommended)
brew install android-platform-tools

# Or download manually from Android developer site
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install android-tools-adb android-tools-fastboot
```

## 📱 Connect Your Device

### 1. Physical Connection
1. **Use a good USB cable** (data cable, not just charging)
2. **Connect phone to computer**
3. **Select "File transfer" or "MTP"** when phone asks about USB connection

### 2. Allow USB Debugging
1. Your phone will show a popup: **"Allow USB debugging?"**
2. Check **"Always allow from this computer"**
3. Tap **"OK"**

### 3. Verify Connection
```bash
# Open terminal/command prompt and run:
adb devices

# Should show something like:
# List of devices attached
# ABC123DEF456    device
```

If you see "unauthorized", disconnect and reconnect the USB cable, then allow debugging again.

## 🚀 Run VoiceNotes Pro on Your Phone

### 1. Prepare the Project
```bash
# Navigate to your VoiceNotes Pro folder
cd VoiceNotesPro

# Make sure dependencies are installed
npm install

# Copy Phase 1 configuration
cp .env.phase1 .env
```

### 2. Start Metro Bundler
```bash
# Start the packager (keep this running)
npm start
```

### 3. Install and Run on Your Phone
```bash
# In a new terminal/command prompt window:
npm run android

# The app will automatically install and launch on your phone!
```

## ✅ Test Core Features

Once the app is running on your phone:

### 1. Grant Microphone Permission
- App will ask for microphone permission
- Tap **"Allow"** or **"While using the app"**

### 2. Test Voice Recognition
1. **Create a new note** (tap the + button)
2. **Tap the microphone button** 🎤
3. **Speak clearly**: "This is my first voice note"
4. **Watch real-time transcription** appear in the text area
5. **Tap microphone again** to stop recording

### 3. Test Basic Features
- ✅ Create/edit/delete notes
- ✅ Create folders with different colors
- ✅ Move notes between folders
- ✅ Search your notes
- ✅ Voice transcription in different environments

## 🔧 Quick Troubleshooting

### Device Not Detected
```bash
# Kill and restart adb
adb kill-server
adb start-server
adb devices
```

### Permission Denied
- **Check USB cable** (use original phone cable if possible)
- **Try different USB port** on your computer
- **Revoke and re-allow** USB debugging in Developer options

### App Won't Install
```bash
# Uninstall any existing version first
adb uninstall com.voicenotespro

# Then try running again
npm run android
```

### Metro Connection Issues
- **Make sure Metro is running** (npm start)
- **Check if phone and computer are on same network** (for wireless debugging)
- **Restart Metro**: Stop with Ctrl+C, then `npm start` again

### App Crashes
```bash
# Check error logs
adb logcat | grep -E "VoiceNotes|ReactNative|AndroidRuntime"
```

## 📱 Wireless Connection (Optional)

For Android 11+ phones, you can connect wirelessly:

### 1. Setup Wireless Debugging
1. **Enable "Wireless debugging"** in Developer options
2. **Connect phone and computer to same Wi-Fi**
3. Tap **"Pair device with pairing code"**

### 2. Pair with Computer
```bash
# Run this command and enter the pairing code from your phone
adb pair [IP_ADDRESS]:[PORT]

# Then connect
adb connect [IP_ADDRESS]:[PORT]

# Verify connection
adb devices
```

Now you can disconnect USB and run `npm run android` wirelessly!

## 🎉 You're Ready!

Your VoiceNotes Pro app should now be running on your Android phone. Test all the features, especially:

- **Voice transcription accuracy**
- **Real-time speech recognition**
- **Note organization with folders**
- **Search functionality**
- **Offline storage**

The app runs completely on your phone with local storage - no internet required for core features!