/**
 * Movements Module - Stock Movement Tracking
 * Handles incoming and outgoing stock movements
 */

const Movements = {
    movements: [],

    // Load movements from storage
    async load() {
        this.movements = await Storage.get(Storage.KEYS.MOVEMENTS) || [];
        return this.movements;
    },

    // Save movements to storage
    async save() {
        await Storage.set(Storage.KEYS.MOVEMENTS, this.movements);
    },

    // Get all movements
    getAll() {
        return this.movements;
    },

    // Add new movement
    add(movementData) {
        const product = Inventory.getById(movementData.productId);
        if (!product) return null;

        const movement = {
            id: 'mov-' + Date.now(),
            productId: movementData.productId,
            productName: product.name,
            type: movementData.type, // 'in' or 'out'
            quantity: parseInt(movementData.quantity) || 0,
            reason: movementData.reason || '',
            notes: movementData.notes || '',
            date: movementData.date || new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        // Update product stock
        const delta = movement.type === 'in' ? movement.quantity : -movement.quantity;
        Inventory.updateStock(movement.productId, delta);

        this.movements.unshift(movement); // Add to beginning
        this.save();
        return movement;
    },

    // Get movements by product
    getByProduct(productId) {
        return this.movements.filter(m => m.productId === productId);
    },

    // Get movements by type
    getByType(type) {
        return this.movements.filter(m => m.type === type);
    },

    // Get movements by date range
    getByDateRange(startDate, endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        return this.movements.filter(m => {
            const date = new Date(m.date).getTime();
            return date >= start && date <= end;
        });
    },

    // Get recent movements (last N)
    getRecent(limit = 10) {
        return this.movements.slice(0, limit);
    },

    // Get movements summary
    getSummary(days = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const recentMovements = this.movements.filter(m =>
            new Date(m.date) >= cutoffDate
        );

        const incoming = recentMovements
            .filter(m => m.type === 'in')
            .reduce((sum, m) => sum + m.quantity, 0);

        const outgoing = recentMovements
            .filter(m => m.type === 'out')
            .reduce((sum, m) => sum + m.quantity, 0);

        return {
            total: recentMovements.length,
            incoming,
            outgoing,
            net: incoming - outgoing
        };
    },

    // Get total sales value (money made)
    getTotalSales() {
        return this.movements
            .filter(m => m.type === 'out')
            .reduce((sum, m) => {
                // Try to find product by ID first
                let product = Inventory.getById(m.productId);

                // If not found by ID, try matching by name (for migrated data)
                if (!product && m.productName) {
                    product = Inventory.getAll().find(p => p.name === m.productName);
                }

                const price = product ? product.price : 0;
                return sum + (m.quantity * price);
            }, 0);
    },

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Format date for table display
    formatDateFull(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};


