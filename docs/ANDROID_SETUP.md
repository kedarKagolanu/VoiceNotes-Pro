# Android Development & Testing Guide

Complete guide for running VoiceNotes Pro on Android devices and emulators.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Android Studio Setup](#android-studio-setup)
3. [Android Emulator Setup](#android-emulator-setup)
4. [Physical Device Setup](#physical-device-setup)
5. [Running the App](#running-the-app)
6. [Testing Features](#testing-features)
7. [Troubleshooting](#troubleshooting)

## 🛠️ Prerequisites

### System Requirements
- **Windows**: 10/11 (64-bit)
- **macOS**: 10.14+ (Mojave)
- **Linux**: Ubuntu 18.04+, other 64-bit distributions
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB+ free space for Android Studio and emulators
- **Processor**: Intel/AMD x64 or Apple Silicon

### Software Requirements
- **Node.js**: 18.0.0 or higher
- **Java**: JDK 11 or 17 (included with Android Studio)
- **Git**: For cloning and version control

## 📱 Android Studio Setup

### 1. Download and Install Android Studio

#### Windows
```bash
# Download from: https://developer.android.com/studio
# Run the installer: android-studio-2023.x.x.x-windows.exe
# Follow installation wizard
```

#### macOS
```bash
# Download from: https://developer.android.com/studio
# Open the DMG file and drag Android Studio to Applications
```

#### Linux (Ubuntu/Debian)
```bash
# Download from: https://developer.android.com/studio
sudo apt update
sudo apt install openjdk-11-jdk
# Extract and run: android-studio/bin/studio.sh
```

### 2. Initial Android Studio Configuration

1. **Launch Android Studio**
2. **Choose Setup Type**: "Standard" installation
3. **Accept Licenses**: Accept all Android SDK licenses
4. **Download Components**: Let it download SDK, build tools, and emulator

### 3. SDK Configuration

1. Open **Android Studio**
2. Go to **Configure** → **SDK Manager** (or **Tools** → **SDK Manager**)
3. **SDK Platforms Tab**:
   - ✅ Android 13 (API 33) - Recommended
   - ✅ Android 12 (API 31)
   - ✅ Android 10 (API 29) - Minimum for testing
   - ✅ Android 6.0 (API 23) - App minimum requirement

4. **SDK Tools Tab**:
   - ✅ Android SDK Build-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
   - ✅ Intel x86 Emulator Accelerator (if using Intel processor)

5. Click **Apply** and **OK** to download

### 4. Environment Variables Setup

#### Windows
1. Open **System Properties** → **Environment Variables**
2. Add new **System Variables**:
```
ANDROID_HOME = C:\Users\[YourUsername]\AppData\Local\Android\Sdk
JAVA_HOME = C:\Program Files\Android\Android Studio\jre
```
3. Add to **PATH**:
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

#### macOS/Linux
Add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# export ANDROID_HOME=$HOME/Android/Sdk        # Linux
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Reload your shell:
```bash
source ~/.bashrc  # or ~/.zshrc
```

### 5. Verify Installation
```bash
# Check if tools are accessible
adb --version
emulator -version
```

## 📲 Android Emulator Setup

### 1. Create Virtual Device

1. Open **Android Studio**
2. Go to **Configure** → **AVD Manager** (or **Tools** → **AVD Manager**)
3. Click **Create Virtual Device**

### 2. Choose Device Definition

**Recommended Devices for Testing:**
- **Pixel 7** - Latest Android features
- **Pixel 4** - Good balance of features and performance
- **Nexus 5X** - Older device testing

Select device and click **Next**

### 3. Select System Image

**Recommended Images:**
- **API 33** (Android 13) - Latest features
- **API 31** (Android 12) - Good compatibility
- **API 29** (Android 10) - Wide compatibility

**Choose Image Type:**
- **Google APIs**: Includes Google Play Services (recommended)
- **Google Play**: Includes Play Store (for testing store features)

Click **Download** if not already downloaded, then **Next**

### 4. Configure AVD

**Advanced Settings:**
- **RAM**: 2048 MB (minimum), 4096 MB (recommended)
- **Internal Storage**: 2048 MB minimum
- **SD Card**: 512 MB (optional)
- **Graphics**: Hardware - GLES 2.0 (for better performance)

**Performance Settings:**
- **Multi-Core CPU**: 4 cores
- **Boot Option**: Cold Boot (for consistent testing)

Click **Finish**

### 5. Start Emulator

#### From Android Studio
1. Open **AVD Manager**
2. Click **Play button** (▶️) next to your virtual device

#### From Command Line
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator @Pixel_7_API_33

# Start with specific options
emulator @Pixel_7_API_33 -no-snapshot-load -wipe-data
```

### 6. Emulator Performance Tips

#### Windows - Enable Hyper-V or HAXM
```bash
# Check if Hyper-V is available
systeminfo | find "Hyper-V"

# If not available, install HAXM from Android Studio SDK Manager
```

#### macOS - No additional setup needed
Apple Silicon and Intel Macs have built-in virtualization

#### Linux - Enable KVM
```bash
# Install KVM
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils

# Add user to kvm group
sudo adduser $USER kvm

# Logout and login again
```

## 🔌 Physical Device Setup

### 1. Enable Developer Options

1. Go to **Settings** → **About phone**
2. Tap **Build number** 7 times
3. You'll see "You are now a developer!"

### 2. Enable USB Debugging

1. Go to **Settings** → **Developer options**
2. Toggle **USB debugging** ON
3. Toggle **Stay awake** ON (optional, keeps screen on while charging)

### 3. Connect Device

#### Windows
1. Connect phone via USB cable
2. If prompted, install device drivers
3. On phone, allow "USB debugging" when prompted
4. Select "Always allow from this computer"

#### macOS
1. Connect phone via USB cable
2. No additional drivers needed
3. Allow USB debugging on phone

#### Linux
1. Connect phone via USB cable
2. You might need to add udev rules:

```bash
# Create udev rules file
sudo nano /etc/udev/rules.d/51-android.rules

# Add device rules (example for common manufacturers)
SUBSYSTEM=="usb", ATTR{idVendor}=="18d1", MODE="0666", GROUP="plugdev" # Google
SUBSYSTEM=="usb", ATTR{idVendor}=="04e8", MODE="0666", GROUP="plugdev" # Samsung
SUBSYSTEM=="usb", ATTR{idVendor}=="0bb4", MODE="0666", GROUP="plugdev" # HTC

# Set permissions and restart udev
sudo chmod a+r /etc/udev/rules.d/51-android.rules
sudo udevadm control --reload-rules
```

### 4. Verify Connection

```bash
# Check if device is detected
adb devices

# Should show something like:
# List of devices attached
# ABC123DEF456    device
```

### 5. Wireless Debugging (Android 11+)

1. Enable **Wireless debugging** in Developer options
2. Connect phone and computer to same Wi-Fi
3. Tap **Pair device with pairing code**
4. Run on computer:
```bash
adb pair [IP_ADDRESS]:[PORT]
# Enter pairing code from phone
```

## 🚀 Running the App

### 1. Prepare Project

```bash
# Navigate to project directory
cd VoiceNotesPro

# Install dependencies (if not done already)
npm install

# Copy Phase 1 environment
cp .env.phase1 .env
```

### 2. Start Metro Bundler

```bash
# Start the React Native packager
npm start

# Or start with cache reset
npm start -- --reset-cache
```

Keep this terminal window open!

### 3. Run on Emulator

#### Method 1: React Native CLI (Recommended)
```bash
# In a new terminal window
npm run android

# Or with specific emulator
npx react-native run-android --deviceId emulator-5554
```

#### Method 2: Android Studio
1. Open Android Studio
2. Import the `android` folder as a project
3. Select your emulator from device dropdown
4. Click **Run** (▶️) button

### 4. Run on Physical Device

```bash
# Make sure device is connected and detected
adb devices

# Run the app
npm run android

# Or target specific device
npx react-native run-android --deviceId ABC123DEF456
```

### 5. Installing APK Directly

```bash
# Build debug APK
cd android
./gradlew assembleDebug

# Install on connected device/emulator
adb install app/build/outputs/apk/debug/app-debug.apk

# Or install and launch
adb install -r app/build/outputs/apk/debug/app-debug.apk
adb shell am start -n com.voicenotespro/.MainActivity
```

## 🧪 Testing Features

### 1. Microphone Permissions

**First Launch:**
1. App will request microphone permission
2. Select **"Allow"** or **"While using the app"**
3. If denied, go to Settings → Apps → VoiceNotes Pro → Permissions

**Testing Voice Recognition:**
1. Create a new note
2. Tap the microphone button 🎤
3. Speak clearly: "This is a test note"
4. Should see real-time transcription

### 2. Core Functionality Test

**Basic Features:**
- ✅ Create new note
- ✅ Edit note title and content
- ✅ Save note (auto-save)
- ✅ Delete note
- ✅ Create folder
- ✅ Move note to folder
- ✅ Search notes
- ✅ Voice transcription

**Performance Test:**
- Create 50+ notes to test scrolling performance
- Test search with various keywords
- Test voice recognition in noisy environment

### 3. Device-Specific Testing

**Different Screen Sizes:**
- Test on small phone (5" screen)
- Test on large phone (6.5"+ screen)
- Test on tablet (if available)

**Different Android Versions:**
- API 23 (Android 6.0) - Minimum requirement
- API 29 (Android 10) - Common version
- API 33 (Android 13) - Latest features

## 🔧 Troubleshooting

### Common Issues

#### 1. "SDK location not found"
```bash
# Create local.properties file in android folder
echo "sdk.dir=/Users/[YourUsername]/Library/Android/sdk" > android/local.properties
# Windows: echo sdk.dir=C:\\Users\\[YourUsername]\\AppData\\Local\\Android\\Sdk > android\\local.properties
```

#### 2. "Command not found: adb"
```bash
# Add Android SDK to PATH (see Environment Variables section)
# Or use full path:
~/Library/Android/sdk/platform-tools/adb devices
```

#### 3. "No connected devices"
```bash
# Kill and restart adb server
adb kill-server
adb start-server
adb devices
```

#### 4. "App crashes on startup"
```bash
# Check device logs
adb logcat | grep -i "VoiceNotes\|ReactNative"

# Clear app data
adb shell pm clear com.voicenotespro
```

#### 5. "Metro bundler connection failed"
```bash
# Check if Metro is running on port 8081
netstat -an | grep 8081

# Restart Metro with port reset
npm start -- --port=8082 --reset-cache
```

#### 6. "Microphone permission denied"
```bash
# Manually grant permission via adb
adb shell pm grant com.voicenotespro android.permission.RECORD_AUDIO

# Or reset app permissions
adb shell pm reset-permissions com.voicenotespro
```

#### 7. "Emulator is slow"
- **Enable Hardware Acceleration**: Check HAXM/Hyper-V/KVM
- **Increase RAM**: Edit AVD settings, increase to 4GB+
- **Use x86_64 images**: Better performance than ARM
- **Close other applications**: Free up system resources

#### 8. "Build failed"
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleDebug

# If still failing, clean node modules
cd ..
rm -rf node_modules
npm install
```

### Device-Specific Issues

#### Samsung Devices
- **Knox Security**: May block some debugging features
- **Battery Optimization**: Disable for VoiceNotes Pro in Device Care

#### Xiaomi/MIUI
- **MIUI Optimization**: Turn off in Developer options
- **Permission Manager**: Manually enable all permissions

#### Huawei Devices
- **Protected Apps**: Add VoiceNotes Pro to protected apps list
- **Battery Optimization**: Disable battery optimization

#### Android 11+ Devices
- **Scoped Storage**: App handles this automatically
- **Package Visibility**: Permissions handled in AndroidManifest.xml

### Performance Optimization

#### Emulator Performance
```bash
# Start emulator with performance options
emulator @Pixel_7_API_33 -gpu host -skin 1080x1920 -memory 4096
```

#### Device Performance
- **Enable Developer Options**: USB debugging, GPU rendering
- **Disable Animations**: Window/Transition animation scale to 0.5x
- **Background Apps**: Close unnecessary background applications

### Debugging Tools

#### React Native Debugging
```bash
# Enable debug mode (shake device or Ctrl+M on emulator)
# Select "Debug JS Remotely" for browser debugging
# Use "Reload" to refresh the app
```

#### Android Studio Profiler
1. Open Android Studio
2. Go to View → Tool Windows → Profiler
3. Select your app and device
4. Monitor CPU, Memory, Network usage

#### ADB Useful Commands
```bash
# View real-time logs
adb logcat

# Install APK
adb install path/to/app.apk

# Uninstall app
adb uninstall com.voicenotespro

# Take screenshot
adb exec-out screencap -p > screenshot.png

# Record screen
adb shell screenrecord /sdcard/recording.mp4
```

## 📞 Getting Help

If you encounter issues:

1. **Check this guide** for common solutions
2. **Review error logs** using `adb logcat`
3. **Search React Native docs** for platform-specific issues
4. **Check Android Studio** for build errors
5. **Test on different devices** to isolate device-specific issues

## 🎯 Next Steps

Once you have the app running:

1. **Test all features** systematically
2. **Create test notes** with voice transcription
3. **Organize with folders** and test search
4. **Try on multiple devices** for compatibility
5. **Prepare for Phase 2** development

You're now ready to develop and test VoiceNotes Pro on Android! 🚀