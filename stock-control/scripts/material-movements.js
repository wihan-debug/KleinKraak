/**
 * Material Movements Module - Raw Material Movement Tracking
 * Handles incoming and outgoing stock movements for raw materials
 */

const MaterialMovements = {
    movements: [],

    // Load movements from storage
    async load() {
        this.movements = await Storage.get('materialMovements') || [];
        return this.movements;
    },

    // Save movements to storage
    async save() {
        await Storage.set('materialMovements', this.movements);
    },

    // Get all movements
    getAll() {
        return this.movements;
    },

    // Add new movement
    add(movementData) {
        const material = Materials.getById(movementData.materialId);
        if (!material) return null;

        const movement = {
            id: 'mat-mov-' + Date.now(),
            materialId: movementData.materialId,
            materialName: material.name,
            type: movementData.type, // 'in' or 'out'
            quantity: parseFloat(movementData.quantity) || 0,
            unit: material.unit,
            reason: movementData.reason || '',
            notes: movementData.notes || '',
            date: movementData.date || new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        // Update material stock
        const delta = movement.type === 'in' ? movement.quantity : -movement.quantity;
        Materials.updateStock(movement.materialId, delta);

        this.movements.unshift(movement); // Add to beginning
        this.save();
        return movement;
    },

    // Get movements by material
    getByMaterial(materialId) {
        return this.movements.filter(m => m.materialId === materialId);
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

