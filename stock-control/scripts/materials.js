/**
 * Materials Module - Raw Materials Management
 * Handles CRUD operations for production materials and ingredients
 */

const Materials = {
    materials: [],

    // Load materials from storage
    async load() {
        this.materials = await Storage.get('kleinkraak-stock-materials') || [];
        if (this.materials.length === 0) {
            await this.initializeSampleData();
        }
        return this.materials;
    },

    // Save materials to storage
    async save() {
        await Storage.set('kleinkraak-stock-materials', this.materials);
    },

    // Initialize with sample data
    async initializeSampleData() {
        this.materials = [
            {
                id: 'mat-' + Date.now() + '-1',
                name: 'Glass Bottles',
                category: 'Packaging',
                quantity: 0,
                unit: 'pieces',
                unitCost: 11.00,
                supplier: '',
                notes: 'For bottling products',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-' + Date.now() + '-2',
                name: 'Bottle Lids',
                category: 'Packaging',
                quantity: 0,
                unit: 'pieces',
                unitCost: 1.25,
                supplier: '',
                notes: 'Lids for glass bottles',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-' + Date.now() + '-3',
                name: 'Garlic',
                category: 'Spices',
                quantity: 0,
                unit: 'kg',
                unitCost: 13.00,
                supplier: '',
                notes: 'Fresh garlic for pickling',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-' + Date.now() + '-4',
                name: 'Mustard Seeds',
                category: 'Spices',
                quantity: 0,
                unit: 'g',
                unitCost: 0.20, // R20 per 100g = R0.20 per gram
                supplier: '',
                notes: 'R20 for 100g',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-' + Date.now() + '-5',
                name: 'Coriander Seeds',
                category: 'Spices',
                quantity: 0,
                unit: 'g',
                unitCost: 0.20, // R20 per 100g = R0.20 per gram
                supplier: '',
                notes: 'R20 for 100g',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-' + Date.now() + '-6',
                name: 'Vinegar',
                category: 'Vinegar',
                quantity: 0,
                unit: 'L',
                unitCost: 7.20, // R180 per 25L = R7.20 per liter
                supplier: '',
                notes: 'R180 for 25L',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-' + Date.now() + '-7',
                name: 'Salt',
                category: 'Dry Goods',
                quantity: 0,
                unit: 'g',
                unitCost: 0.10, // R25 per 250g = R0.10 per gram
                supplier: '',
                notes: 'R25 for 250g',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-' + Date.now() + '-8',
                name: 'Sugar',
                category: 'Dry Goods',
                quantity: 0,
                unit: 'kg',
                unitCost: 28.00, // R70 per 2.5kg = R28 per kg
                supplier: '',
                notes: 'R70 for 2.5kg',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-' + Date.now() + '-9',
                name: 'Dill',
                category: 'Grown',
                quantity: 0,
                unit: 'kg',
                unitCost: 0.00,
                supplier: 'Home Grown',
                notes: 'Grown on-site - no cost',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-' + Date.now() + '-10',
                name: 'Grape Leaves',
                category: 'Grown',
                quantity: 0,
                unit: 'pieces',
                unitCost: 0.00,
                supplier: 'Home Grown',
                notes: 'Grown on-site - no cost',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-' + Date.now() + '-11',
                name: 'Drink-O-Pop Powder',
                category: 'Other',
                quantity: 0,
                unit: 'packets',
                unitCost: 1.03, // R80 per 78 packets = R1.03 per packet
                supplier: '',
                notes: 'R80 for 78 packets - 1 packet makes 1 bottle',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-' + Date.now() + '-12',
                name: 'White Wine Vinegar',
                category: 'Vinegar',
                quantity: 0,
                unit: 'L',
                unitCost: 0.00,
                supplier: '',
                notes: 'Price to be determined',
                createdAt: new Date().toISOString()
            },
            {
                id: 'mat-' + Date.now() + '-13',
                name: 'Apple Cider Vinegar',
                category: 'Vinegar',
                quantity: 0,
                unit: 'L',
                unitCost: 0.00,
                supplier: '',
                notes: 'Price to be determined',
                createdAt: new Date().toISOString()
            }
        ];
        await this.save();
    },

    // Get all materials
    getAll() {
        return this.materials;
    },

    // Get material by ID
    getById(id) {
        return this.materials.find(m => m.id === id);
    },

    // Add new material
    add(materialData) {
        const material = {
            id: 'mat-' + Date.now(),
            name: materialData.name,
            category: materialData.category,
            quantity: parseFloat(materialData.quantity) || 0,
            unit: materialData.unit,
            unitCost: parseFloat(materialData.unitCost) || 0,
            supplier: materialData.supplier || '',
            notes: materialData.notes || '',
            createdAt: new Date().toISOString()
        };

        this.materials.push(material);
        this.save();
        return material;
    },

    // Update existing material
    update(id, materialData) {
        const index = this.materials.findIndex(m => m.id === id);
        if (index === -1) return null;

        this.materials[index] = {
            ...this.materials[index],
            name: materialData.name,
            category: materialData.category,
            quantity: parseFloat(materialData.quantity) || 0,
            unit: materialData.unit,
            unitCost: parseFloat(materialData.unitCost) || 0,
            supplier: materialData.supplier || '',
            notes: materialData.notes || '',
            updatedAt: new Date().toISOString()
        };

        this.save();
        return this.materials[index];
    },

    // Delete material
    delete(id) {
        const index = this.materials.findIndex(m => m.id === id);
        if (index === -1) return false;

        this.materials.splice(index, 1);
        this.save();
        return true;
    },

    // Get total materials value
    getTotalValue() {
        return this.materials.reduce((sum, m) => sum + (m.quantity * m.unitCost), 0);
    },

    // Search materials
    search(query) {
        const lowerQuery = query.toLowerCase();
        return this.materials.filter(m =>
            m.name.toLowerCase().includes(lowerQuery) ||
            m.category.toLowerCase().includes(lowerQuery) ||
            (m.supplier && m.supplier.toLowerCase().includes(lowerQuery))
        );
    },

    // Filter by category
    filterByCategory(category) {
        if (!category) return this.materials;
        return this.materials.filter(m => m.category === category);
    },

    // Update stock quantity
    updateStock(id, delta) {
        const material = this.getById(id);
        if (!material) return false;

        material.quantity = Math.max(0, material.quantity + delta);
        material.updatedAt = new Date().toISOString();
        this.save();
        return material;
    }
};


