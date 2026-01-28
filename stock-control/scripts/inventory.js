/**
 * Inventory Module - Product Management
 * Handles CRUD operations for products
 */

const Inventory = {
    products: [],

    // Helpers for fallback storage
    _getLocal(key) {
        return JSON.parse(localStorage.getItem('kleinkraak-stock-' + key)) || [];
    },

    _getHardcoded() {
        return [
            { id: 'hc1', name: 'White Wine Vinegar Cucamelons', price: 150.00 },
            { id: 'hc2', name: 'Spicy Pickled Cucamelons', price: 120.00 },
            { id: 'hc3', name: 'Dill & Garlic Pickled Cucamelons', price: 120.00 },
            { id: 'hc4', name: 'Sweet & Sour Pickled Cucamelons', price: 120.00 },
            { id: 'hc5', name: 'Sweet Cucamelons', price: 120.00 },
            { id: 'hc6', name: 'Fresh Cucamelons (250g)', price: 50.00 },
            { id: 'hc7', name: 'French Salad Dressing', price: 120.00 },
            { id: 'hc8', name: 'Garlic And Herb Salad Dressing', price: 120.00 },
            { id: 'hc9', name: 'Sweet&Spicy', price: 120.00 },
            { id: 'hc10', name: 'Pickled Apple Cider Vinegar', price: 130.00 }
        ];
    },

    // Load products from storage (Firebase or Local or Hardcoded)
    async load() {
        try {
            if (typeof Storage !== 'undefined' && Storage.get) {
                this.products = await Storage.get(Storage.KEYS.PRODUCTS) || [];
            } else {
                throw new Error("Storage missing");
            }
        } catch (e) {
            console.warn("Inventory: Loading from primary storage failed, trying fallbacks.");
            // Fallback 1: LocalStorage
            this.products = this._getLocal('products');
        }

        // Fallback 2: Hardcoded (if still empty)
        if (!this.products || this.products.length === 0) {
            console.warn("Inventory: Using hardcoded fallback data.");
            this.products = this._getHardcoded();
        }

        return this.products;
    },

    // Save products to storage
    async save() {
        if (typeof Storage !== 'undefined' && Storage.set) {
            await Storage.set(Storage.KEYS.PRODUCTS, this.products);
        } else {
            localStorage.setItem('kleinkraak-stock-products', JSON.stringify(this.products));
        }
    },

    // Get all products
    getAll() {
        return this.products;
    },

    // Get product by ID
    getById(id) {
        return this.products.find(p => p.id === id);
    },

    // Add new product
    add(productData) {
        const product = {
            id: 'prod-' + Date.now(),
            name: productData.name,
            category: productData.category,
            quantity: parseInt(productData.quantity) || 0,
            reorderLevel: parseInt(productData.reorderLevel) || 0,
            price: parseFloat(productData.price) || 0,
            supplier: productData.supplier || '',
            notes: productData.notes || '',
            createdAt: new Date().toISOString()
        };

        this.products.push(product);
        this.save();
        return product;
    },

    // Update existing product
    update(id, productData) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return null;

        this.products[index] = {
            ...this.products[index],
            name: productData.name,
            category: productData.category,
            quantity: parseInt(productData.quantity) || 0,
            reorderLevel: parseInt(productData.reorderLevel) || 0,
            price: parseFloat(productData.price) || 0,
            supplier: productData.supplier || '',
            notes: productData.notes || '',
            updatedAt: new Date().toISOString()
        };

        this.save();
        return this.products[index];
    },

    // Delete product
    delete(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return false;

        this.products.splice(index, 1);
        this.save();
        return true;
    },

    // Update stock quantity
    updateStock(id, delta) {
        const product = this.getById(id);
        if (!product) return false;

        product.quantity += delta;
        if (product.quantity < 0) product.quantity = 0;

        this.save();
        return true;
    },

    // Get low stock products
    getLowStock() {
        return this.products.filter(p => p.quantity <= p.reorderLevel);
    },

    // Get total stock value
    getTotalValue() {
        return this.products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
    },

    // Search products
    search(query) {
        const lowerQuery = query.toLowerCase();
        return this.products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            (p.supplier && p.supplier.toLowerCase().includes(lowerQuery))
        );
    },

    // Filter by category
    filterByCategory(category) {
        if (!category) return this.products;
        return this.products.filter(p => p.category === category);
    },

    // Get stock status
    getStatus(product) {
        if (product.quantity === 0) return 'out';
        if (product.quantity <= product.reorderLevel) return 'low';
        return 'good';
    },

    // Get status badge class
    getStatusBadge(product) {
        const status = this.getStatus(product);
        switch (status) {
            case 'out': return 'badge-danger';
            case 'low': return 'badge-warning';
            default: return 'badge-success';
        }
    },

    // Get status text
    getStatusText(product) {
        const status = this.getStatus(product);
        switch (status) {
            case 'out': return 'Out of Stock';
            case 'low': return 'Low Stock';
            default: return 'In Stock';
        }
    }
};

// Make Globally Available
window.Inventory = Inventory;


