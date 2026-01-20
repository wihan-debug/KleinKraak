# Firebase Setup Guide

Follow these steps to enable real-time cross-device synchronization for your KleinKraak stock control system.

## Step 1: Create Firebase Project

1. Go to https://firebase.google.com/
2. Click "Get Started" or "Go to Console"
3. Sign in with your Google account
4. Click "Add project" or "Create a project"
5. Enter project name: `kleinkraak-stock-control`
6. Disable Google Analytics (not needed for this project)
7. Click "Create project"

## Step 2: Set Up Realtime Database

1. In your Firebase console, click "Realtime Database" in the left menu
2. Click "Create Database"
3. Select location: Choose closest to South Africa (e.g., "europe-west1")
4. Start in **TEST MODE** (we'll secure it with the password later)
5. Click "Enable"

## Step 3: Get Your Configuration Keys

1. In Firebase console, click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the "</>" (Web) icon to add a web app
5. Enter app nickname: `KleinKraak Web`
6. **Do NOT** check "Set up Firebase Hosting"
7. Click "Register app"
8. Copy the configuration object (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 4: Update firebase-config.js

1. Open `F:\KleinKraak\stock-control\scripts\firebase-config.js`
2. Replace the placeholder config with your actual Firebase config
3. Save the file

## Step 5: Configure Security Rules

1. In Firebase console, go to "Realtime Database"
2. Click the "Rules" tab
3. Replace with these rules (allows read/write for everyone - secured by admin password on frontend):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

4. Click "Publish"

## Done! 🎉

Your Firebase project is now set up. The stock control system will automatically:
- Sync data across all devices in real-time
- Migrate existing localStorage data to Firebase on first load
- Work offline and sync when connection returns

**Note:** Keep your Firebase config keys private. Don't share them publicly, but it's okay to include them in your Netlify deployment since access is protected by your admin password.
