/**
 * Firebase Configuration and Initialization
 * Sets up Firebase Realtime Database for cross-device synchronization
 */

// Import Firebase modules from CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getDatabase, ref, onValue, set, push, update, remove, get } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

// TODO: Replace with your Firebase project configuration
// Get this from Firebase Console > Project Settings > Your apps > Web app
const firebaseConfig = {
    apiKey: "AIzaSyBLYTt1Wz4AcxDlQtnL374f0ntYuNG6C6U",
    authDomain: "kleinkraak-49f26.firebaseapp.com",
    databaseURL: "https://kleinkraak-49f26-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "kleinkraak-49f26",
    storageBucket: "kleinkraak-49f26.firebasestorage.app",
    messagingSenderId: "82607492969",
    appId: "1:82607492969:web:73ab3ad041ca3cea0337f8",
    measurementId: "G-39PR70CELK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Database references
const dbRefs = {
    inventory: ref(database, 'inventory'),
    movements: ref(database, 'movements'),
    materials: ref(database, 'materials')
};

// Export Firebase utilities
export {
    database,
    dbRefs,
    ref,
    onValue,
    set,
    push,
    update,
    remove,
    get
};
