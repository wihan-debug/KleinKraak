/**
 * Invoices Logic for Root Admin
 * Handles invoice creation within the #invoice-modal in index.html
 */

const InvoiceManager = {
    // Current invoice state
    state: {
        products: [],
        items: [],
        delivery: 0
    },

    // Called when loading invoice-manager.js on the dedicated page
    initPage() {
        // EMERGENCY FIX: Hardcode products directly into state to bypass loading issues
        // Products with BOTH retail and wholesale prices (from catalogue.html)
        const manualProducts = [
            { id: 'hc1', name: 'White Wine Vinegar', price: 150.00, wholesalePrice: 120.00 },
            { id: 'hc2', name: 'Spicy Pickled Cucamelons', price: 120.00, wholesalePrice: 96.00 },
            { id: 'hc3', name: 'Dill & Garlic Pickled Cucamelons', price: 120.00, wholesalePrice: 96.00 },
            { id: 'hc4', name: 'Sweet & Sour Pickled Cucamelons', price: 120.00, wholesalePrice: 96.00 },
            { id: 'hc5', name: 'Sweet Cucamelons', price: 120.00, wholesalePrice: 96.00 },
            { id: 'hc6', name: 'Fresh Cucamelons (250g)', price: 50.00, wholesalePrice: 40.00 },
            { id: 'hc7', name: 'French Salad Dressing', price: 120.00, wholesalePrice: 96.00 },
            { id: 'hc8', name: 'Garlic And Herb Salad Dressing', price: 120.00, wholesalePrice: 96.00 },
            { id: 'hc9', name: 'Sweet&Spicy', price: 120.00, wholesalePrice: 96.00 },
            { id: 'hc10', name: 'Pickled Apple Cider Vinegar', price: 130.00, wholesalePrice: 104.00 }
        ];

        console.log("InvoiceManager: EMERGENCY LOADING HARDCODED PRODUCTS", manualProducts);
        this.state.products = manualProducts;

        this.setupEventListeners();

        // Try to load additional/live products in background, but don't block
        setTimeout(() => this.loadProducts(), 100);

        // Set default values formatted correctly
        const numberInput = document.getElementById('inv-number');
        if (numberInput) {
            numberInput.value = `INV-${Date.now().toString().slice(-6)}`;
        }

        const dateInput = document.getElementById('inv-date');
        if (dateInput) {
            dateInput.valueAsDate = new Date();
        }

        // Add initial item row - NOW it will have products guaranteed
        this.addItemRow();
    },

    init() {
        this.initPage();
    },

    async loadProducts() {
        // Background attempt to load live data
        if (typeof Inventory !== 'undefined') {
            try {
                await Inventory.load();
                const liveProducts = Inventory.getAll();
                if (liveProducts && liveProducts.length > 0) {
                    console.log("InvoiceManager: Live products loaded, overriding hardcoded.", liveProducts);
                    this.state.products = liveProducts;
                    // Only refresh if user hasn't started editing? 
                    // Or just refresh the hidden selects in existing rows?
                    // For now, let's NOT disrupt the user if they already started.
                    // But we should update the state for NEW rows.
                }
            } catch (e) {
                console.warn("Retaining hardcoded products due to load failure:", e);
            }
        }
    },

    refreshItemRows() {
        // Deprecated / No-op in emergency mode to prevent clearing user work
    },

    setupEventListeners() {
        const addItemBtn = document.getElementById('add-invoice-item-btn');
        if (addItemBtn) addItemBtn.addEventListener('click', () => this.addItemRow());

        const downloadBtn = document.getElementById('download-invoice-btn');
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.generatePDF());

        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) resetBtn.addEventListener('click', () => {
            if (confirm('Clear all fields?')) location.reload();
        });

        // Delivery Fee Listener - CRITICAL FIX
        const deliveryInput = document.getElementById('inv-delivery');
        if (deliveryInput) {
            deliveryInput.addEventListener('input', () => {
                this.updateTotal();
            });
        }

        // WHOLESALE/RETAIL TOGGLE LISTENER
        const priceTypeInputs = document.querySelectorAll('input[name="price-type"]');
        priceTypeInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.refreshAllProductDropdowns();
            });
        });

        // Live calculation listeners for general inputs
        document.getElementById('invoice-form-area')?.addEventListener('input', (e) => {
            if (e.target.matches('input') || e.target.matches('select')) {
                // If it's not an item row input, just update the preview if needed
                if (!e.target.closest('.invoice-item-row') && e.target.id !== 'inv-delivery') {
                    this.updatePreview();
                }
            }
        });
    },

    // Get current price type
    getPriceType() {
        const priceTypeRadio = document.querySelector('input[name="price-type"]:checked');
        return priceTypeRadio ? priceTypeRadio.value : 'retail';
    },

    // Get product price based on current price type
    getProductPrice(product) {
        const priceType = this.getPriceType();
        return priceType === 'wholesale' ? (product.wholesalePrice || product.price) : product.price;
    },

    // Refresh all product dropdowns when price type changes
    refreshAllProductDropdowns() {
        const rows = document.querySelectorAll('.invoice-item-row');
        const priceType = this.getPriceType();

        rows.forEach(row => {
            const select = row.querySelector('.item-select');
            const priceInput = row.querySelector('.item-price');

            if (select && select.style.display !== 'none') {
                const currentValue = select.value;

                // Rebuild options with new pricing
                const currentProducts = this.state.products || [];
                let opts = `<option value="">Select Product...</option>`;
                currentProducts.forEach(p => {
                    const displayPrice = this.getProductPrice(p);
                    const priceLabel = priceType === 'wholesale' ? '(Wholesale)' : '';
                    opts += `<option value="${p.id}" data-retail-price="${p.price}" data-wholesale-price="${p.wholesalePrice || p.price}" data-name="${p.name}">${p.name} ${priceLabel} (R${displayPrice.toFixed(2)})</option>`;
                });
                opts += `<option value="custom">-- Custom / Manual Item --</option>`;
                select.innerHTML = opts;

                // Restore selection if it was set
                if (currentValue && currentValue !== '') {
                    select.value = currentValue;

                    // Update price in price input
                    if (currentValue !== 'custom') {
                        const option = select.options[select.selectedIndex];
                        const newPrice = priceType === 'wholesale'
                            ? option.getAttribute('data-wholesale-price')
                            : option.getAttribute('data-retail-price');
                        priceInput.value = newPrice;
                        this.updateItemTotal(row);
                    }
                }
            }
        });
    },

    // Add item row with Select Dropdown
    addItemRow(item = null) {
        const container = document.getElementById('invoice-items-container');
        if (!container) return;

        const row = document.createElement('div');
        row.className = 'invoice-item-row';
        row.style.cssText = "display: flex; gap: 10px; margin-bottom: 10px; align-items: center;";

        const products = this.state.products || [];

        // Build Options
        const priceType = this.getPriceType();
        let optionsHtml = `<option value="">Select Product...</option>`;
        products.forEach(p => {
            const displayPrice = this.getProductPrice(p);
            const priceLabel = priceType === 'wholesale' ? '(Wholesale)' : '';
            optionsHtml += `<option value="${p.id}" data-retail-price="${p.price}" data-wholesale-price="${p.wholesalePrice || p.price}" data-name="${p.name}">${p.name} ${priceLabel} (R${displayPrice.toFixed(2)})</option>`;
        });
        optionsHtml += `<option value="custom">-- Custom / Manual Item --</option>`;

        // HTML Structure
        row.innerHTML = `
            <div class="item-input-wrapper" style="flex: 3;">
                <select class="item-select" style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px; background: #fff;">
                    ${optionsHtml}
                </select>
                <input type="text" class="item-desc" placeholder="Enter Description" style="display: none; width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px;" value="${item ? item.description : ''}">
            </div>

            <div style="flex: 1;">
                <input type="number" class="item-qty" value="${item ? item.qty : 1}" min="1" style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px;" placeholder="Qty">
            </div>
            <div style="flex: 1;">
                <input type="number" class="item-price" value="${item ? item.price : 0}" step="0.01" style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px;" placeholder="Price">
            </div>
            <div style="width: 80px; text-align: right; padding-top: 10px; font-weight: 600;">
                R <span class="item-total">${item ? (item.qty * item.price).toFixed(2) : '0.00'}</span>
            </div>
            <button type="button" class="remove-item-btn" style="color: #C62828; border: none; background: none; cursor: pointer; padding: 5px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        `;

        // Elements
        const select = row.querySelector('.item-select');
        const descInput = row.querySelector('.item-desc');
        const qtyInput = row.querySelector('.item-qty');
        const priceInput = row.querySelector('.item-price');
        const removeBtn = row.querySelector('.remove-item-btn');

        // Helper to populate select options (reused)
        const populateSelect = (sel) => {
            const currentProducts = this.state.products || [];
            const priceType = this.getPriceType();
            let opts = `<option value="">Select Product...</option>`;
            currentProducts.forEach(p => {
                const displayPrice = this.getProductPrice(p);
                const priceLabel = priceType === 'wholesale' ? '(Wholesale)' : '';
                opts += `<option value="${p.id}" data-retail-price="${p.price}" data-wholesale-price="${p.wholesalePrice || p.price}" data-name="${p.name}">${p.name} ${priceLabel} (R${displayPrice.toFixed(2)})</option>`;
            });
            opts += `<option value="custom">-- Custom / Manual Item --</option>`;
            sel.innerHTML = opts;
        };

        // Build initial options
        populateSelect(select);

        // Logic: Handle Select Change
        select.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === 'custom') {
                // Switch to text input mode
                // We conceal the select but keep a small "back" button or link?
                // Or just replace styles. 
                // Let's try: Hide Select, Show Input, Show "X" button to revert.

                select.style.display = 'none';

                // Show Input
                descInput.style.display = 'block';
                descInput.value = '';
                descInput.focus();

                // Show Revert Button (create if needed)
                let revertBtn = row.querySelector('.revert-btn');
                if (!revertBtn) {
                    revertBtn = document.createElement('button');
                    revertBtn.className = 'revert-btn';
                    revertBtn.type = 'button';
                    revertBtn.innerHTML = '&#8634;'; // Reload/Back icon
                    revertBtn.title = "Back to List";
                    revertBtn.style.cssText = "padding: 8px; border: 1px solid #ccc; background: #f0f0f0; border-radius: 4px; cursor: pointer; margin-left: 5px;";
                    revertBtn.addEventListener('click', () => {
                        descInput.style.display = 'none';
                        descInput.value = '';
                        select.style.display = 'block';
                        select.value = '';
                        priceInput.value = 0;
                        revertBtn.style.display = 'none';
                        this.updateItemTotal(row);
                    });
                    row.querySelector('.item-input-wrapper').appendChild(revertBtn);
                } else {
                    revertBtn.style.display = 'inline-block';
                }

                priceInput.value = 0; // Reset price
            } else if (val) {
                // Product selected
                const option = select.options[select.selectedIndex];
                const priceType = this.getPriceType();
                const price = priceType === 'wholesale'
                    ? option.getAttribute('data-wholesale-price')
                    : option.getAttribute('data-retail-price');
                const name = option.getAttribute('data-name');

                priceInput.value = price;
                // We sync the hidden desc input too for consistency in data gathering
                descInput.value = name;

                this.updateItemTotal(row);
            }
        });

        // Listeners
        descInput.addEventListener('input', () => this.updatePreview()); // Update preview on text change

        [qtyInput, priceInput].forEach(input => {
            input.addEventListener('input', () => {
                this.updateItemTotal(row);
            });
        });

        removeBtn.addEventListener('click', () => {
            row.remove();
            this.updateTotal();
        });

        container.appendChild(row);

        // If loading an item that doesn't match a product ID (or custom), show text input
        if (item && item.description) {
            // Try to find match
            // Simple match by name if ID matches?
            // For now, if we have item data, maybe default to custom if not perfect match?
            // Or just check if desc matches a product name
            const match = products.find(p => p.name === item.description);
            if (match) {
                select.value = match.id;
            } else {
                select.value = 'custom';
                select.style.display = 'none';
                descInput.style.display = 'block';
            }
        }

        this.updateTotal();
    },

    // Refresh rows (if inventory loads late)
    refreshItemRows() {
        const container = document.getElementById('invoice-items-container');
        if (!container) return;

        // If we have 1 row and it's empty (default state), replace it with our new Select-based row
        const rows = container.getElementsByClassName('invoice-item-row');
        if (rows.length === 1) {
            const row = rows[0];
            // Check if it's the old style or just empty
            // If Select exists, we might want to repopulate options?
            const select = row.querySelector('select');
            if (select) {
                // Re-run addItemRow to get fresh options and clear
                container.innerHTML = '';
                this.addItemRow();
            } else {
                // It's the old text input style?
                container.innerHTML = '';
                this.addItemRow();
            }
        }
    },

    updateItemTotal(rowElement) {
        const qty = parseFloat(rowElement.querySelector('.item-qty').value) || 0;
        const price = parseFloat(rowElement.querySelector('.item-price').value) || 0;
        const total = qty * price;
        rowElement.querySelector('.item-total').textContent = total.toFixed(2);
        this.updateTotal();
    },

    updateTotal() {
        const container = document.getElementById('invoice-items-container');
        if (!container) return;

        let subtotal = 0;
        const rows = container.getElementsByClassName('invoice-item-row');

        Array.from(rows).forEach(row => {
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            subtotal += qty * price;
        });

        this.state.subtotal = subtotal;

        const deliveryInput = document.getElementById('inv-delivery');
        const delivery = deliveryInput ? (parseFloat(deliveryInput.value) || 0) : 0;
        this.state.delivery = delivery;

        this.state.total = subtotal + delivery;

        // Update UI
        const subtotalEl = document.getElementById('display-subtotal');
        if (subtotalEl) subtotalEl.textContent = this.state.subtotal.toFixed(2);

        const totalEl = document.getElementById('display-total');
        if (totalEl) totalEl.textContent = this.state.total.toFixed(2);

        this.updatePreview();
    },

    updatePreview() {
        // Safe helper to set text if element exists
        const setIfExists = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        // Update header info
        const name = document.getElementById('inv-name')?.value || 'Customer Name';
        const email = document.getElementById('inv-email')?.value || '';
        const address = document.getElementById('inv-address')?.value || '';
        const phone = document.getElementById('inv-phone')?.value || '';
        const invoiceNumber = document.getElementById('inv-number')?.value || '';
        const invoiceDate = document.getElementById('inv-date')?.value || '';

        setIfExists('preview-client-name', name);
        setIfExists('preview-client-email', email);
        setIfExists('preview-client-address', address);
        setIfExists('preview-client-phone', phone);
        setIfExists('preview-inv-number', invoiceNumber);
        setIfExists('preview-inv-date', invoiceDate);

        // Update item rows in preview
        const previewItemsBody = document.getElementById('preview-items-body');
        if (previewItemsBody) {
            previewItemsBody.innerHTML = '';
            document.querySelectorAll('.invoice-item-row').forEach(row => {
                const select = row.querySelector('.item-select');
                const descInput = row.querySelector('.item-desc');

                let desc = '';
                if (select && select.style.display !== 'none' && select.value !== '' && select.value !== 'custom') {
                    const option = select.options[select.selectedIndex];
                    desc = option.getAttribute('data-name') || option.text;
                } else if (descInput) {
                    desc = descInput.value;
                }

                const qty = row.querySelector('.item-qty').value;
                const price = parseFloat(row.querySelector('.item-price').value).toFixed(2);
                const total = row.querySelector('.item-total').textContent;

                if (desc) {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${desc}</td>
                        <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee;">${qty}</td>
                        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">R ${price}</td>
                        <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">R ${total}</td>
                    `;
                    previewItemsBody.appendChild(tr);
                }
            });
        }

        // Update totals in preview
        setIfExists('preview-subtotal', 'R ' + this.state.subtotal.toFixed(2));
        setIfExists('preview-delivery', 'R ' + this.state.delivery.toFixed(2));
        setIfExists('preview-total', 'R ' + this.state.total.toFixed(2));
    },

    generatePDF() {
        const btn = document.getElementById('download-invoice-btn');
        const element = document.getElementById('invoice-template');
        const invNum = document.getElementById('inv-number')?.value || 'invoice';

        if (!element) return;

        // Show status
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Generating...';
        btn.disabled = true;

        // 1. Force Recalculation to ensure totals are fresh
        this.updateTotal();

        // 2. Populate PDF Template explicitly (Inline logic)
        const setText = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        // Clear previous content
        ['pdf-client-name', 'pdf-client-address', 'pdf-client-email', 'pdf-inv-number', 'pdf-inv-date', 'pdf-subtotal', 'pdf-delivery', 'pdf-total'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '';
        });

        // Header / Client Info
        setText('pdf-client-name', document.getElementById('inv-name').value);
        const address = document.getElementById('inv-address').value || '';
        const phone = document.getElementById('inv-phone').value || '';
        setText('pdf-client-address', address + (phone ? ` • ${phone}` : ''));
        setText('pdf-client-email', document.getElementById('inv-email').value);
        setText('pdf-inv-number', document.getElementById('inv-number').value);
        setText('pdf-inv-date', document.getElementById('inv-date').value);

        // Items Table
        const tbody = document.getElementById('pdf-items-body');
        tbody.innerHTML = '';

        document.querySelectorAll('.invoice-item-row').forEach(row => {
            const select = row.querySelector('.item-select');
            const descInput = row.querySelector('.item-desc');

            let desc = '';
            // Determine Description (Dropdown or Manual)
            if (select && select.style.display !== 'none' && select.value !== '' && select.value !== 'custom') {
                // Dropdown selected
                const option = select.options[select.selectedIndex];
                desc = option.getAttribute('data-name') || option.text;
            } else if (descInput && (descInput.style.display !== 'none' || select.value === 'custom')) {
                // Manual input active
                desc = descInput.value;
            }

            // Fallback: If select has value but hidden, rely on descInput? 
            // Better: trust the visible one.

            const qty = row.querySelector('.item-qty').value;
            const price = parseFloat(row.querySelector('.item-price').value).toFixed(2);
            const total = row.querySelector('.item-total').textContent;

            if (desc) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #333;">${desc}</td>
                    <td style="padding: 12px; text-align: center; border-bottom: 1px solid #eee; font-size: 14px; color: #333;">${qty}</td>
                    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee; font-size: 14px; color: #333;">R ${price}</td>
                    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee; font-size: 14px; font-weight: bold; color: #333;">R ${total}</td>
                `;
                tbody.appendChild(tr);
            }
        });

        // Totals
        setText('pdf-subtotal', 'R ' + this.state.subtotal.toFixed(2));
        setText('pdf-delivery', 'R ' + this.state.delivery.toFixed(2));
        setText('pdf-total', 'R ' + this.state.total.toFixed(2));

        // 3. Render
        if (typeof html2pdf === 'undefined') {
            alert("Error: PDF Library not loaded (html2pdf). Check internet connection.");
            btn.innerHTML = originalText;
            btn.disabled = false;
            return;
        }

        element.style.display = 'block';

        const opt = {
            margin: 0.5,
            filename: `Invoice_${invNum}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save()
            .then(() => {
                element.style.display = 'none';
                btn.innerHTML = originalText;
                btn.disabled = false;
            })
            .catch((err) => {
                console.error("PDF Generate Error", err);
                alert("PDF Generate Error: " + err.message);
                element.style.display = 'none';
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
    }
};

window.InvoiceManager = InvoiceManager;
