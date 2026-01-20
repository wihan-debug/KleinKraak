/**
 * Reports Module - Analytics and Reporting
 * Handles report generation and data export
 */

const Reports = {
    // Generate stock summary report
    getStockSummary() {
        const products = Inventory.getAll();
        const totalProducts = products.length;
        const totalValue = Inventory.getTotalValue();
        const lowStockCount = Inventory.getLowStock().length;

        const byCategory = {};
        products.forEach(p => {
            if (!byCategory[p.category]) {
                byCategory[p.category] = {
                    count: 0,
                    quantity: 0,
                    value: 0
                };
            }
            byCategory[p.category].count++;
            byCategory[p.category].quantity += p.quantity;
            byCategory[p.category].value += p.quantity * p.price;
        });

        return {
            totalProducts,
            totalValue,
            lowStockCount,
            byCategory
        };
    },

    // Generate movement summary report
    getMovementSummary(days = 30) {
        return Movements.getSummary(days);
    },

    // Export to CSV
    exportToCSV() {
        const products = Inventory.getAll();

        // CSV Headers
        let csv = 'Product Name,Category,Current Stock,Reorder Level,Unit Price,Stock Value,Status,Supplier,Notes\n';

        // CSV Rows
        products.forEach(p => {
            const stockValue = (p.quantity * p.price).toFixed(2);
            const status = Inventory.getStatusText(p);

            csv += `"${p.name}","${p.category}",${p.quantity},${p.reorderLevel},${p.price.toFixed(2)},${stockValue},"${status}","${p.supplier || ''}","${p.notes || ''}"\n`;
        });

        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kleinkraak-stock-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },

    // Export movements to CSV
    exportMovementsToCSV() {
        const movements = Movements.getAll();

        // CSV Headers
        let csv = 'Date & Time,Product,Type,Quantity,Reason/Supplier,Notes\n';

        // CSV Rows
        movements.forEach(m => {
            const date = new Date(m.date).toLocaleString('en-ZA');
            const type = m.type === 'in' ? 'Stock In' : 'Stock Out';

            csv += `"${date}","${m.productName}","${type}",${m.quantity},"${m.reason}","${m.notes || ''}"\n`;
        });

        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kleinkraak-movements-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },

    // Print report
    printReport() {
        window.print();
    },

    // Render stock summary
    renderStockSummary() {
        const summary = this.getStockSummary();
        const container = document.getElementById('stock-summary');

        let html = `
            <div class="summary-item">
                <span class="summary-label">Total Products</span>
                <span class="summary-value">${summary.totalProducts}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Total Stock Value</span>
                <span class="summary-value">R ${summary.totalValue.toFixed(2)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Low Stock Items</span>
                <span class="summary-value">${summary.lowStockCount}</span>
            </div>
        `;

        // Add category breakdown
        Object.entries(summary.byCategory).forEach(([category, data]) => {
            html += `
                <div class="summary-item">
                    <span class="summary-label">${category} (${data.count} products)</span>
                    <span class="summary-value">R ${data.value.toFixed(2)}</span>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // Render movement summary
    renderMovementSummary() {
        const summary = this.getMovementSummary(30);
        const container = document.getElementById('movement-summary');

        const html = `
            <div class="summary-item">
                <span class="summary-label">Total Movements</span>
                <span class="summary-value">${summary.total}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Stock In</span>
                <span class="summary-value" style="color: var(--success);">+${summary.incoming}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Stock Out</span>
                <span class="summary-value" style="color: var(--danger);">-${summary.outgoing}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Net Change</span>
                <span class="summary-value" style="color: ${summary.net >= 0 ? 'var(--success)' : 'var(--danger)'};">
                    ${summary.net >= 0 ? '+' : ''}${summary.net}
                </span>
            </div>
        `;

        container.innerHTML = html;
    }
};
