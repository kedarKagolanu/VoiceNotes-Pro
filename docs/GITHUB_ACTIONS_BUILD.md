# GitHub Actions Build Guide - Complete Setup

Build your VoiceNotes Pro Android APK for FREE using GitHub's cloud servers. No local storage used!

## 📋 Table of Contents

1. [Why GitHub Actions?](#why-github-actions)
2. [Account Setup](#account-setup)
3. [Repository Setup](#repository-setup)
4. [GitHub Actions Configuration](#github-actions-configuration)
5. [Build Process](#build-process)
6. [Download & Install APK](#download--install-apk)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Configuration](#advanced-configuration)

## 🚀 Why GitHub Actions?

### **Benefits:**
- ✅ **100% Free**: 2000 build minutes/month
- ✅ **No Local Storage**: Builds on GitHub's servers
- ✅ **Professional Environment**: Ubuntu servers with proper Java/Gradle setup
- ✅ **Automatic**: Builds every time you push code changes
- ✅ **Download APK**: Get the final APK file directly

### **What You Get:**
- **Final APK size**: ~25-40MB
- **Local storage used**: ~10MB (just your code)
- **Build time**: 5-10 minutes per build
- **Quality**: Same as local builds, often better

## 👤 Account Setup

### Step 1: Create GitHub Account

1. **Go to GitHub**: https://github.com/
2. **Click "Sign up"**
3. **Fill in details**:
   - **Username**: `your-username` (choose carefully, can't change easily)
   - **Email**: Your email address
   - **Password**: Strong password
4. **Verify email** when GitHub sends verification
5. **Choose Free plan** (sufficient for our needs)

### Step 2: Verify Account
- **Check your email** and click verification link
- **Complete GitHub onboarding** (can skip most steps)

## 📁 Repository Setup

### Step 1: Create New Repository

1. **Click "+" icon** in top right → "New repository"
2. **Repository Details**:
   - **Repository name**: `VoiceNotes-Pro`
   - **Description**: `Real-time voice transcription mobile app`
   - **Visibility**: Public (required for free GitHub Actions)
   - **Initialize**: ✅ Add a README file
   - **Add .gitignore**: Node
   - **Choose license**: MIT License

3. **Click "Create repository"**

### Step 2: Upload Your Project

#### Method A: GitHub Web Interface (Easiest)

1. **Download project as ZIP**:
   ```bash
   # In your local project folder
   cd "C:\dev\Voice Notes App"
   
   # Create a ZIP of your project (excluding large folders)
   # Manually select these folders/files:
   # - src/
   # - docs/
   # - package.json
   # - package-lock.json
   # - babel.config.js
   # - metro.config.js
   # - tsconfig.json
   # - index.js
   # - app.json
   # - .env.phase1
   # - android/app/src/
   # - android/build.gradle
   # - android/settings.gradle
   # - android/gradle.properties
   # - ios/ (if you want iOS builds later)
   ```

2. **Upload to GitHub**:
   - **Click "uploading an existing file"** in your repository
   - **Drag and drop** your project files (NOT node_modules or android/build)
   - **Commit message**: "Initial VoiceNotes Pro project upload"
   - **Click "Commit changes"**

#### Method B: Git Command Line (If you have Git)

```bash
# In your project directory
cd "C:\dev\Voice Notes App"

# Initialize git
git init
git remote add origin https://github.com/YOUR-USERNAME/VoiceNotes-Pro.git

# Create .gitignore to exclude large files
echo "node_modules/
android/build/
android/.gradle/
.gradle/
*.apk
*.aab
.env
.env.local
.DS_Store
*.log" > .gitignore

# Add files and commit
git add .
git commit -m "Initial VoiceNotes Pro project"
git branch -M main
git push -u origin main
```

## ⚙️ GitHub Actions Configuration

### Step 1: Create Workflow Directory

In your GitHub repository:

1. **Click "Actions" tab**
2. **Click "set up a workflow yourself"**
3. **This creates**: `.github/workflows/main.yml`

### Step 2: Configure Android Build Workflow

Replace the default content with this Android build configuration:

```yaml
name: Build Android APK

# Trigger builds on push to main branch and pull requests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  # Allow manual triggers
  workflow_dispatch:

jobs:
  build:
    name: Build APK
    runs-on: ubuntu-latest
    
    steps:
    # Step 1: Checkout source code
    - name: Checkout repository
      uses: actions/checkout@v4
      
    # Step 2: Setup Node.js environment
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    # Step 3: Setup Java for Android builds
    - name: Setup JDK
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        
    # Step 4: Setup Android SDK
    - name: Setup Android SDK
      uses: android-actions/setup-android@v3
      
    # Step 5: Install dependencies
    - name: Install dependencies
      run: |
        npm ci
        
    # Step 6: Cache Gradle dependencies
    - name: Cache Gradle dependencies
      uses: actions/cache@v3
      with:
        path: |
          ~/.gradle/caches
          ~/.gradle/wrapper
        key: gradle-${{ runner.os }}-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
        restore-keys: |
          gradle-${{ runner.os }}-
          
    # Step 7: Make gradlew executable
    - name: Make gradlew executable
      run: chmod +x ./android/gradlew
      
    # Step 8: Create environment file
    - name: Create environment file
      run: |
        cp .env.phase1 .env
        
    # Step 9: Build APK
    - name: Build Debug APK
      run: |
        cd android
        ./gradlew assembleDebug --stacktrace
        
    # Step 10: Upload APK as artifact
    - name: Upload APK
      uses: actions/upload-artifact@v4
      with:
        name: voicenotes-pro-debug
        path: android/app/build/outputs/apk/debug/app-debug.apk
        retention-days: 30
        
    # Step 11: Create release APK (optional)
    - name: Build Release APK
      if: github.ref == 'refs/heads/main'
      run: |
        cd android
        ./gradlew assembleRelease --stacktrace
        
    # Step 12: Upload Release APK
    - name: Upload Release APK
      if: github.ref == 'refs/heads/main'
      uses: actions/upload-artifact@v4
      with:
        name: voicenotes-pro-release
        path: android/app/build/outputs/apk/release/app-release.apk
        retention-days: 30
```

### Step 3: Commit Workflow File

1. **File name**: Keep as `main.yml`
2. **Commit message**: "Add Android build workflow"
3. **Click "Commit changes"**

## 🏗️ Build Process

### Automatic Builds

Your app will build automatically when:
- ✅ **Push to main branch**: Any code changes trigger a build
- ✅ **Pull requests**: Test builds for code reviews
- ✅ **Manual trigger**: Click "Run workflow" in Actions tab

### Manual Build

To trigger a build manually:

1. **Go to your repository**
2. **Click "Actions" tab**
3. **Click "Build Android APK" workflow**
4. **Click "Run workflow"**
5. **Select branch**: main
6. **Click "Run workflow" button**

### Monitor Build Progress

1. **Click on the running build**
2. **Click "Build APK" job**
3. **Watch each step execute**:
   - ✅ Checkout code
   - ✅ Setup Node.js
   - ✅ Setup Java & Android SDK
   - ✅ Install dependencies
   - ✅ Build APK
   - ✅ Upload artifact

### Build Time Expectations

- **First build**: 8-12 minutes (downloading dependencies)
- **Subsequent builds**: 3-6 minutes (using cache)
- **Failed builds**: 1-3 minutes (fail fast)

## 📥 Download & Install APK

### Step 1: Download APK

After successful build:

1. **Go to Actions tab** in your repository
2. **Click the completed build** (green checkmark)
3. **Scroll down to "Artifacts" section**
4. **Click "voicenotes-pro-debug"** to download ZIP
5. **Extract ZIP** to get `app-debug.apk`

### Step 2: Install on Android Device

#### Method A: USB Install
```bash
# Connect your Android device via USB
adb devices

# Install the APK
adb install app-debug.apk

# Launch the app
adb shell am start -n com.voicenotespro/.MainActivity
```

#### Method B: Direct Transfer
1. **Copy APK** to your phone (via USB, cloud, email)
2. **On phone**: Open file manager
3. **Tap the APK** file
4. **Allow "Install unknown apps"** if prompted
5. **Tap "Install"**

### Step 3: Test the App

Once installed:
1. **Grant microphone permission** when prompted
2. **Test voice transcription**
3. **Create notes and folders**
4. **Verify all features work**

## 🔧 Troubleshooting

### Common Build Failures

#### 1. **Gradle Build Failed**
```yaml
# Add to your workflow before build step:
- name: Clean Gradle
  run: |
    cd android
    ./gradlew clean
```

#### 2. **Out of Memory**
```yaml
# Add to workflow environment:
env:
  GRADLE_OPTS: -Xmx2048m -Dorg.gradle.daemon=false
```

#### 3. **SDK License Issues**
```yaml
# Add after Setup Android SDK:
- name: Accept SDK licenses
  run: yes | sdkmanager --licenses
```

#### 4. **Node.js Version Issues**
```yaml
# Change Node.js version:
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '16'  # Try different version
```

#### 5. **Missing Dependencies**
```yaml
# Add before build:
- name: Install missing dependencies
  run: |
    npm install react-native-vector-icons
    npm install react-native-permissions
```

### Debugging Build Issues

#### View Detailed Logs
1. **Click failed build** in Actions tab
2. **Click "Build APK" job**
3. **Expand failed step** to see error details
4. **Look for specific error messages**

#### Common Error Solutions

**Error: "Could not find tools.jar"**
```yaml
# Use different JDK distribution:
- name: Setup JDK
  uses: actions/setup-java@v4
  with:
    java-version: '11'
    distribution: 'adopt'
```

**Error: "React Native command not found"**
```yaml
# Install React Native CLI:
- name: Install React Native CLI
  run: npm install -g @react-native-community/cli
```

**Error: "Gradle wrapper not found"**
```yaml
# Generate gradle wrapper:
- name: Generate Gradle wrapper
  run: |
    cd android
    gradle wrapper
```

## 🚀 Advanced Configuration

### Automatic Version Bumping

```yaml
# Add before build:
- name: Bump version
  run: |
    npm version patch
    git config user.name github-actions
    git config user.email github-actions@github.com
    git add .
    git commit -m "Bump version [skip ci]"
    git push
```

### Build Multiple Variants

```yaml
strategy:
  matrix:
    variant: [debug, release]
    
steps:
- name: Build ${{ matrix.variant }} APK
  run: |
    cd android
    ./gradlew assemble${{ matrix.variant }}
```

### Slack/Discord Notifications

```yaml
# Add at end of job:
- name: Notify on success
  if: success()
  run: |
    curl -X POST -H 'Content-type: application/json' \
    --data '{"text":"✅ VoiceNotes Pro build succeeded!"}' \
    ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Automated Testing

```yaml
# Add before build:
- name: Run tests
  run: |
    npm test -- --coverage --watchAll=false
    
- name: Run E2E tests
  run: |
    npm run test:e2e
```

## 📊 Usage Monitoring

### GitHub Actions Limits (Free Plan)
- **Build minutes**: 2000/month
- **Storage**: 500MB for artifacts
- **Concurrent jobs**: 20
- **Job duration**: Max 6 hours each

### Optimize Build Time
```yaml
# Use caching aggressively:
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

- name: Cache Gradle
  uses: actions/cache@v3
  with:
    path: ~/.gradle
    key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*') }}
```

## 🎯 Next Steps

Once your build is working:

1. **Set up automatic builds** on every code change
2. **Create release builds** for app store submission
3. **Add automated testing** to catch issues early
4. **Set up notifications** for build status
5. **Plan for Phase 2** features with same build system

## 📞 Support

If you encounter issues:

1. **Check build logs** in Actions tab for detailed errors
2. **Search GitHub Actions documentation** for specific issues
3. **Check React Native GitHub Issues** for known problems
4. **Review this guide** for common solutions

## 🎉 Success Checklist

- [ ] GitHub account created
- [ ] Repository set up with your VoiceNotes Pro code
- [ ] GitHub Actions workflow configured
- [ ] First build completed successfully
- [ ] APK downloaded and tested on Android device
- [ ] Voice transcription working
- [ ] All Phase 1 features functional

**Congratulations! You now have a professional, cloud-based build system for your VoiceNotes Pro app!** 🚀

---

**Total Local Storage Used**: ~10MB (just your source code)
**Build Quality**: Professional grade
**Cost**: $0 (completely free)
**Maintenance**: Automatic