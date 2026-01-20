/**
 * Firebase Storage Module - Data Persistence Layer
 * Handles Firebase Realtime Database operations for KleinKraak Stock Control
 * Replaces localStorage with real-time cloud sync
 */

import { database, dbRefs, onValue, set, push, update, remove, get, ref } from './firebase-config.js';

const FirebaseStorage = {
    KEYS: {
        PRODUCTS: 'products',
        MOVEMENTS: 'movements',
        MATERIALS: 'materials',
        SETTINGS: 'settings'
    },

    // Track if data has been migrated from localStorage
    migrated: false,

    // Real-time listeners
    listeners: {},

    // Connection state
    isOnline: true,

    // Initialize Firebase storage and migrate data from localStorage
    async init() {
        console.log('🔥 Initializing Firebase Storage...');

        // Monitor connection state
        this.monitorConnection();

        // Migrate existing localStorage data to Firebase if not already done
        await this.migrateFromLocalStorage();

        // Initialize sample data if Firebase is empty
        await this.initializeSampleData();

        console.log('✅ Firebase Storage initialized');
    },

    // Monitor Firebase connection state
    monitorConnection() {
        const connectedRef = ref(database, '.info/connected');
        onValue(connectedRef, (snapshot) => {
            this.isOnline = snapshot.val() === true;
            this.updateConnectionStatus();
            console.log(this.isOnline ? '🟢 Connected to Firebase' : '🔴 Disconnected from Firebase');
        });
    },

    // Update UI connection status indicator
    updateConnectionStatus() {
        const statusEl = document.getElementById('connection-status');
        if (statusEl) {
            if (this.isOnline) {
                statusEl.innerHTML = '🟢 Online';
                statusEl.classList.remove('offline');
                statusEl.classList.add('online');
            } else {
                statusEl.innerHTML = '🔴 Offline';
                statusEl.classList.remove('online');
                statusEl.classList.add('offline');
            }
        }
    },

    // Migrate data from localStorage to Firebase (one-time operation)
    async migrateFromLocalStorage() {
        const migrationFlag = localStorage.getItem('kleinkraak-firebase-migrated');

        if (migrationFlag === 'true') {
            console.log('✓ Data already migrated to Firebase');
            this.migrated = true;
            return;
        }

        console.log('📦 Migrating localStorage data to Firebase...');

        try {
            // Migrate products
            const localProducts = localStorage.getItem('kleinkraak-stock-products');
            if (localProducts) {
                const products = JSON.parse(localProducts);
                if (products && products.length > 0) {
                    console.log(`  → Migrating ${products.length} products...`);
                    await set(dbRefs.inventory, products);
                }
            }

            // Migrate movements
            const localMovements = localStorage.getItem('kleinkraak-stock-movements');
            if (localMovements) {
                const movements = JSON.parse(localMovements);
                if (movements && movements.length > 0) {
                    console.log(`  → Migrating ${movements.length} movements...`);
                    await set(dbRefs.movements, movements);
                }
            }

            // Migrate materials
            const localMaterials = localStorage.getItem('kleinkraak-materials');
            if (localMaterials) {
                const materials = JSON.parse(localMaterials);
                if (materials && materials.length > 0) {
                    console.log(`  → Migrating ${materials.length} materials...`);
                    await set(dbRefs.materials, materials);
                }
            }

            // Mark migration as complete
            localStorage.setItem('kleinkraak-firebase-migrated', 'true');
            this.migrated = true;
            console.log('✅ Migration complete!');
        } catch (error) {
            console.error('❌ Migration failed:', error);
        }
    },

    // Get data from Firebase
    async get(key) {
        try {
            const dataRef = ref(database, key);
            const snapshot = await get(dataRef);
            return snapshot.exists() ? snapshot.val() : null;
        } catch (error) {
            console.error('Error reading from Firebase:', error);
            return null;
        }
    },

    // Save data to Firebase
    async set(key, value) {
        try {
            const dataRef = ref(database, key);
            await set(dataRef, value);
            return true;
        } catch (error) {
            console.error('Error writing to Firebase:', error);
            return false;
        }
    },

    // Remove data from Firebase
    async remove(key) {
        try {
            const dataRef = ref(database, key);
            await remove(dataRef);
            return true;
        } catch (error) {
            console.error('Error removing from Firebase:', error);
            return false;
        }
    },

    // Listen to real-time updates
    listen(key, callback) {
        const dataRef = ref(database, key);
        const unsubscribe = onValue(dataRef, (snapshot) => {
            const data = snapshot.exists() ? snapshot.val() : null;
            callback(data);
        });

        this.listeners[key] = unsubscribe;
        return unsubscribe;
    },

    // Stop listening to updates
    unlisten(key) {
        if (this.listeners[key]) {
            this.listeners[key]();
            delete this.listeners[key];
        }
    },

    // Clear all app data
    async clearAll() {
        try {
            await Promise.all([
                this.remove(this.KEYS.PRODUCTS),
                this.remove(this.KEYS.MOVEMENTS),
                this.remove(this.KEYS.MATERIALS),
                this.remove(this.KEYS.SETTINGS)
            ]);
            return true;
        } catch (error) {
            console.error('Error clearing all data:', error);
            return false;
        }
    },

    // Initialize with sample data if Firebase is empty
    async initializeSampleData() {
        const products = await this.get(this.KEYS.PRODUCTS);

        if (!products || products.length === 0) {
            console.log('📝 Initializing sample data...');
            const sampleProducts = [
                {
                    id: 'prod-' + Date.now() + '-1',
                    name: 'White Wine Vinegar Cucamelons',
                    category: 'Vinegar',
                    quantity: 36, // 3 boxes × 12 bottles
                    reorderLevel: 60, // 5 boxes
                    price: 150.00,
                    supplier: 'Local Supplier',
                    notes: 'Premium white wine vinegar infused - 3 boxes in stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'prod-' + Date.now() + '-2',
                    name: 'Spicy Pickled Cucamelons',
                    category: 'Pickled',
                    quantity: 144, // 12 boxes × 12 bottles
                    reorderLevel: 120, // 10 boxes
                    price: 120.00,
                    supplier: 'Local Supplier',
                    notes: 'With chilli and garlic - 12 boxes in stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'prod-' + Date.now() + '-3',
                    name: 'Dill & Garlic Pickled Cucamelons',
                    category: 'Pickled',
                    quantity: 96, // 8 boxes × 12 bottles
                    reorderLevel: 120, // 10 boxes
                    price: 120.00,
                    supplier: 'Local Supplier',
                    notes: 'Classic dill flavor - 8 boxes in stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'prod-' + Date.now() + '-4',
                    name: 'Sweet & Sour Pickled Cucamelons',
                    category: 'Pickled',
                    quantity: 180, // 15 boxes × 12 bottles
                    reorderLevel: 120, // 10 boxes
                    price: 120.00,
                    supplier: 'Local Supplier',
                    notes: 'Balanced sweet and tangy - 15 boxes in stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'prod-' + Date.now() + '-5',
                    name: 'Sweet Cucamelons',
                    category: 'Pickled',
                    quantity: 36, // 3 boxes × 12 bottles
                    reorderLevel: 60, // 5 boxes
                    price: 120.00,
                    supplier: 'Local Supplier',
                    notes: 'Sweet with Drink-O-Pop powder - 3 boxes in stock',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 'prod-' + Date.now() + '-6',
                    name: 'Fresh Cucamelons (250g)',
                    category: 'Fresh',
                    quantity: 50, // 50 individual packets
                    reorderLevel: 30,
                    price: 50.00,
                    supplier: 'Farm Fresh',
                    notes: 'Freshly harvested - 50 packets in stock',
                    createdAt: new Date().toISOString()
                }
            ];

            await this.set(this.KEYS.PRODUCTS, sampleProducts);
        }

        const movements = await this.get(this.KEYS.MOVEMENTS);
        if (!movements || movements.length === 0) {
            await this.set(this.KEYS.MOVEMENTS, []);
        }

        const materials = await this.get(this.KEYS.MATERIALS);
        if (!materials || materials.length === 0) {
            await this.set(this.KEYS.MATERIALS, []);
        }
    },

    // Export data as JSON
    async exportData() {
        return {
            products: await this.get(this.KEYS.PRODUCTS) || [],
            movements: await this.get(this.KEYS.MOVEMENTS) || [],
            materials: await this.get(this.KEYS.MATERIALS) || [],
            exportDate: new Date().toISOString()
        };
    },

    // Import data from JSON
    async importData(data) {
        try {
            if (data.products) {
                await this.set(this.KEYS.PRODUCTS, data.products);
            }
            if (data.movements) {
                await this.set(this.KEYS.MOVEMENTS, data.movements);
            }
            if (data.materials) {
                await this.set(this.KEYS.MATERIALS, data.materials);
            }
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};

// Make it globally available (for backward compatibility)
window.Storage = FirebaseStorage;

// Auto-initialize
FirebaseStorage.init();

export default FirebaseStorage;
