/**
 * KleinKraak Stock Control - Main Application
 * Handles UI interactions and view management
 */

// Application State
const App = {
    currentView: 'dashboard',
    editingProductId: null,

    // Initialize application
    async init() {
        // Load data first
        await Inventory.load();
        await Movements.load();
        await Materials.load();
        await MaterialMovements.load();



        // Then setup UI
        this.setupNavigation();
        this.setupModals();
        this.setupForms();
        this.setupSearch();
        this.renderDashboard();
        this.renderInventory();
        this.renderMovements();
        this.renderMaterials();
        this.renderReports();
    },

    // Setup navigation
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const menuBtn = document.getElementById('mobile-menu-btn');

        // Toggle sidebar
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            });
        }

        // Close sidebar on overlay click
        if (overlay) {
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        }

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                this.switchView(view);

                // Close sidebar on mobile when item clicked
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    if (overlay) overlay.classList.remove('active');
                }
            });
        });
    },

    // Switch between views
    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}-view`).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            inventory: 'Inventory',
            movements: 'Stock Movements',
            materials: 'Raw Materials',
            'material-movements': 'Material Movements',
            reports: 'Reports'
        };
        document.getElementById('page-title').textContent = titles[viewName];

        this.currentView = viewName;

        // Clear search when switching views
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            searchInput.value = '';
        }

        // Update search placeholder
        this.updateSearchPlaceholder();

        // Refresh view data
        switch (viewName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'inventory':
                this.renderInventory();
                break;
            case 'movements':
                this.renderMovements();
                break;
            case 'materials':
                this.renderMaterials();
                break;
            case 'material-movements':
                this.renderMaterialMovements();
                break;
            case 'reports':
                this.renderReports();
                break;
            case 'invoices':
                if (typeof Invoices !== 'undefined') Invoices.refreshProductSelect();
                break;
        }
    },

    // Setup modals
    setupModals() {
        const overlay = document.getElementById('overlay');

        // Product modal
        const productModal = document.getElementById('product-modal');
        const closeProductModal = document.getElementById('close-product-modal');
        const cancelProductBtn = document.getElementById('cancel-product-btn');

        document.getElementById('add-product-btn').addEventListener('click', () => {
            this.openProductModal();
        });

        closeProductModal.addEventListener('click', () => this.closeProductModal());
        cancelProductBtn.addEventListener('click', () => this.closeProductModal());

        // Movement modal
        const movementModal = document.getElementById('movement-modal');
        const closeMovementModal = document.getElementById('close-movement-modal');
        const cancelMovementBtn = document.getElementById('cancel-movement-btn');

        document.getElementById('add-incoming-btn').addEventListener('click', () => {
            this.openMovementModal('in');
        });

        document.getElementById('add-outgoing-btn').addEventListener('click', () => {
            this.openMovementModal('out');
        });

        closeMovementModal.addEventListener('click', () => this.closeMovementModal());
        cancelMovementBtn.addEventListener('click', () => this.closeMovementModal());

        // Material modal
        const materialModal = document.getElementById('material-modal');
        const closeMaterialModal = document.getElementById('close-material-modal');
        const cancelMaterialBtn = document.getElementById('cancel-material-btn');

        document.getElementById('add-material-btn').addEventListener('click', () => {
            this.openMaterialModal();
        });

        closeMaterialModal.addEventListener('click', () => this.closeMaterialModal());
        cancelMaterialBtn.addEventListener('click', () => this.closeMaterialModal());

        // Material Movement modal
        const materialMovementModal = document.getElementById('material-movement-modal');
        const closeMaterialMovementModal = document.getElementById('close-material-movement-modal');
        const cancelMaterialMovementBtn = document.getElementById('cancel-material-movement-btn');

        document.getElementById('add-material-incoming-btn').addEventListener('click', () => {
            this.openMaterialMovementModal('in');
        });

        document.getElementById('add-material-outgoing-btn').addEventListener('click', () => {
            this.openMaterialMovementModal('out');
        });

        closeMaterialMovementModal.addEventListener('click', () => this.closeMaterialMovementModal());
        cancelMaterialMovementBtn.addEventListener('click', () => this.closeMaterialMovementModal());

        // Close on overlay click
        overlay.addEventListener('click', () => {
            this.closeProductModal();
            this.closeMovementModal();
            this.closeMaterialModal();
            this.closeMaterialMovementModal();
        });
    },

    // Setup forms
    setupForms() {
        // Product form
        const productForm = document.getElementById('product-form');
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProductSubmit();
        });

        // Box to bottle conversion for product form
        const productBoxesInput = document.getElementById('product-boxes');
        const productQuantityInput = document.getElementById('product-quantity');
        const productCategorySelect = document.getElementById('product-category');
        const productBoxesGroup = productBoxesInput.closest('.form-group');

        // Toggle boxes field based on category
        productCategorySelect.addEventListener('change', (e) => {
            const category = e.target.value;
            if (category === 'Fresh') {
                // Hide boxes field for Fresh products
                productBoxesGroup.style.display = 'none';
                productBoxesInput.value = '';
                productQuantityInput.readOnly = false;
                productQuantityInput.style.background = '';
                productQuantityInput.value = '';
            } else {
                // Show boxes field for Pickled/Vinegar/Other
                productBoxesGroup.style.display = 'block';
                productQuantityInput.readOnly = true;
                productQuantityInput.style.background = '#f5f5f5';
            }
        });

        productBoxesInput.addEventListener('input', (e) => {
            const boxes = parseInt(e.target.value) || 0;
            const bottles = boxes * 12;
            productQuantityInput.value = bottles;
        });

        // Movement form
        const movementForm = document.getElementById('movement-form');
        movementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleMovementSubmit();
        });

        // Box to bottle conversion for movement form
        const movementBoxesInput = document.getElementById('movement-boxes');
        const movementQuantityInput = document.getElementById('movement-quantity');
        const movementProductSelect = document.getElementById('movement-product');
        const movementBoxesGroup = movementBoxesInput.closest('.form-group');

        // Show/hide boxes field based on selected product's category
        movementProductSelect.addEventListener('change', (e) => {
            const productId = e.target.value;
            if (!productId) {
                movementBoxesGroup.style.display = 'none';
                movementQuantityInput.readOnly = false;
                movementQuantityInput.style.background = '';
                return;
            }

            const product = Inventory.getById(productId);
            if (product && product.category === 'Fresh') {
                // Hide boxes field for Fresh products
                movementBoxesGroup.style.display = 'none';
                movementBoxesInput.value = '';
                movementQuantityInput.readOnly = false;
                movementQuantityInput.style.background = '';
                movementQuantityInput.value = '';
            } else {
                // Show boxes field for Pickled/Vinegar/Other
                movementBoxesGroup.style.display = 'block';
                movementQuantityInput.readOnly = true;
                movementQuantityInput.style.background = '#f5f5f5';
            }
        });

        movementBoxesInput.addEventListener('input', (e) => {
            const boxes = parseInt(e.target.value) || 0;
            const bottles = boxes * 12;
            movementQuantityInput.value = bottles;
        });

        // Material form
        const materialForm = document.getElementById('material-form');
        materialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleMaterialSubmit();
        });

        // Box conversion for glass bottles
        const materialNameInput = document.getElementById('material-name');
        const materialBoxesInput = document.getElementById('material-boxes');
        const materialQuantityInput = document.getElementById('material-quantity');
        const materialBoxesGroup = document.getElementById('material-boxes-group');
        const materialQuantityHint = document.getElementById('material-quantity-hint');

        // Show/hide boxes field based on material name
        materialNameInput.addEventListener('input', (e) => {
            const name = e.target.value.toLowerCase();
            if (name.includes('glass bottle') || name.includes('bottle') && !name.includes('lid')) {
                materialBoxesGroup.style.display = 'block';
                materialQuantityHint.style.display = 'block';
                materialQuantityInput.readOnly = true;
                materialQuantityInput.style.background = '#f5f5f5';
            } else {
                materialBoxesGroup.style.display = 'none';
                materialQuantityHint.style.display = 'none';
                materialQuantityInput.readOnly = false;
                materialQuantityInput.style.background = '';
            }
        });

        // Box to pieces conversion for glass bottles
        materialBoxesInput.addEventListener('input', (e) => {
            const boxes = parseInt(e.target.value) || 0;
            const pieces = boxes * 12;
            materialQuantityInput.value = pieces;
        });

        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.addEventListener('change', () => {
            this.renderInventory();
        });

        // Export buttons
        document.getElementById('export-csv-btn').addEventListener('click', () => {
            Reports.exportToCSV();
        });

        document.getElementById('print-report-btn').addEventListener('click', () => {
            Reports.printReport();
        });

        // Material Movement form
        const materialMovementForm = document.getElementById('material-movement-form');
        materialMovementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleMaterialMovementSubmit();
        });

        // Update unit label when material is selected
        const materialMovementMaterialSelect = document.getElementById('material-movement-material');
        materialMovementMaterialSelect.addEventListener('change', (e) => {
            const materialId = e.target.value;
            if (!materialId) return;

            const material = Materials.getById(materialId);
            if (material) {
                const unitLabel = document.getElementById('material-movement-unit-label');
                unitLabel.textContent = `Enter quantity in ${material.unit}`;
            }
        });
    },

    // Setup search
    setupSearch() {
        const searchInput = document.getElementById('global-search');
        const searchBox = searchInput.closest('.search-box');
        const searchIcon = searchBox.querySelector('svg');

        // Mobile search toggle
        const isMobile = () => window.innerWidth <= 768;

        // Add mobile-hidden class by default on mobile
        const updateSearchBoxState = () => {
            if (isMobile()) {
                if (!searchBox.classList.contains('mobile-active')) {
                    searchBox.classList.add('mobile-hidden');
                }
            } else {
                searchBox.classList.remove('mobile-hidden', 'mobile-active');
            }
        };

        // Initialize
        updateSearchBoxState();
        window.addEventListener('resize', updateSearchBoxState);

        // Click on search icon to toggle on mobile
        searchIcon.addEventListener('click', (e) => {
            if (isMobile() && searchBox.classList.contains('mobile-hidden')) {
                e.stopPropagation();
                searchBox.classList.remove('mobile-hidden');
                searchBox.classList.add('mobile-active');
                searchInput.focus();
            }
        });

        // Click outside to close on mobile
        document.addEventListener('click', (e) => {
            if (isMobile() && searchBox.classList.contains('mobile-active')) {
                if (!searchBox.contains(e.target)) {
                    searchBox.classList.remove('mobile-active');
                    searchBox.classList.add('mobile-hidden');
                    searchInput.value = '';
                    // Re-render current view to clear search
                    this.refreshCurrentView();
                }
            }
        });

        // Prevent clicks inside search box from closing it
        searchBox.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Handle search input
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.performSearch(query);
        });

        // Update placeholder based on current view
        this.updateSearchPlaceholder();
    },

    // Perform search across different views
    performSearch(query) {
        switch (this.currentView) {
            case 'inventory':
                this.renderInventory(query);
                break;
            case 'materials':
                this.renderMaterials(query);
                break;
            case 'movements':
                this.renderMovements(query);
                break;
            case 'material-movements':
                this.renderMaterialMovements(query);
                break;
            default:
                // Dashboard and reports don't have search
                break;
        }
    },

    // Update search placeholder based on view
    updateSearchPlaceholder() {
        const searchInput = document.getElementById('global-search');
        const placeholders = {
            dashboard: 'Search...',
            inventory: 'Search products...',
            materials: 'Search materials...',
            movements: 'Search movements...',
            'material-movements': 'Search material movements...',
            reports: 'Search...'
        };
        searchInput.placeholder = placeholders[this.currentView] || 'Search...';
    },

    // Refresh current view
    refreshCurrentView() {
        switch (this.currentView) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'inventory':
                this.renderInventory();
                break;
            case 'movements':
                this.renderMovements();
                break;
            case 'materials':
                this.renderMaterials();
                break;
            case 'reports':
                this.renderReports();
                break;
            case 'invoices':
                if (typeof Invoices !== 'undefined') Invoices.refreshProductSelect();
                break;
        }
    },

    // Open product modal
    openProductModal(productId = null) {
        this.editingProductId = productId;
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('product-modal-title');
        const form = document.getElementById('product-form');
        const boxesInput = document.getElementById('product-boxes');
        const boxesGroup = boxesInput.closest('.form-group');
        const quantityInput = document.getElementById('product-quantity');

        form.reset();

        if (productId) {
            // Edit mode
            title.textContent = 'Edit Product';
            const product = Inventory.getById(productId);
            if (product) {
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-category').value = product.category;

                // Check if Fresh category
                if (product.category === 'Fresh') {
                    // Hide boxes field for Fresh products
                    boxesGroup.style.display = 'none';
                    quantityInput.readOnly = false;
                    quantityInput.style.background = '';
                    document.getElementById('product-quantity').value = product.quantity;
                } else {
                    // Show boxes field for other categories
                    boxesGroup.style.display = 'block';
                    quantityInput.readOnly = true;
                    quantityInput.style.background = '#f5f5f5';

                    // Calculate boxes from bottles
                    const boxes = Math.floor(product.quantity / 12);
                    const remainingBottles = product.quantity % 12;

                    if (remainingBottles === 0 && boxes > 0) {
                        // Perfect box count
                        boxesInput.value = boxes;
                    } else {
                        // Has remaining bottles, clear boxes field
                        boxesInput.value = '';
                    }

                    document.getElementById('product-quantity').value = product.quantity;
                }

                document.getElementById('product-reorder').value = product.reorderLevel;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-supplier').value = product.supplier || '';
                document.getElementById('product-notes').value = product.notes || '';
            }
        } else {
            // Add mode
            title.textContent = 'Add Product';
            // Default: hide boxes field until category is selected
            boxesGroup.style.display = 'none';
            quantityInput.readOnly = false;
            quantityInput.style.background = '';
        }

        modal.classList.add('active');
        document.getElementById('overlay').classList.add('active');
    },

    // Close product modal
    closeProductModal() {
        document.getElementById('product-modal').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
        this.editingProductId = null;
    },

    // Handle product form submit
    handleProductSubmit() {
        const formData = {
            name: document.getElementById('product-name').value,
            category: document.getElementById('product-category').value,
            quantity: document.getElementById('product-quantity').value,
            reorderLevel: document.getElementById('product-reorder').value,
            price: document.getElementById('product-price').value,
            supplier: document.getElementById('product-supplier').value,
            notes: document.getElementById('product-notes').value
        };

        if (this.editingProductId) {
            Inventory.update(this.editingProductId, formData);
        } else {
            Inventory.add(formData);
        }

        this.closeProductModal();
        this.renderInventory();
        this.renderDashboard();
    },

    // Open movement modal
    openMovementModal(type) {
        const modal = document.getElementById('movement-modal');
        const title = document.getElementById('movement-modal-title');
        const form = document.getElementById('movement-form');
        const productSelect = document.getElementById('movement-product');

        form.reset();
        document.getElementById('movement-type').value = type;

        title.textContent = type === 'in' ? 'Record Stock In' : 'Record Stock Out';

        // Populate product dropdown
        const products = Inventory.getAll();
        productSelect.innerHTML = '<option value="">Select Product</option>';
        products.forEach(p => {
            productSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
        });

        // Set current date/time
        const now = new Date();
        const dateString = now.toISOString().slice(0, 16);
        document.getElementById('movement-date').value = dateString;

        modal.classList.add('active');
        document.getElementById('overlay').classList.add('active');
    },

    // Close movement modal
    closeMovementModal() {
        document.getElementById('movement-modal').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    },

    // Handle movement form submit
    handleMovementSubmit() {
        const formData = {
            productId: document.getElementById('movement-product').value,
            type: document.getElementById('movement-type').value,
            quantity: document.getElementById('movement-quantity').value,
            reason: document.getElementById('movement-reason').value,
            date: document.getElementById('movement-date').value,
            notes: document.getElementById('movement-notes').value
        };

        Movements.add(formData);
        this.closeMovementModal();
        this.renderMovements();
        this.renderInventory();
        this.renderDashboard();
    },

    // Render dashboard
    renderDashboard() {
        const products = Inventory.getAll();
        const lowStock = Inventory.getLowStock();
        const totalValue = Inventory.getTotalValue();
        const totalSales = Movements.getTotalSales();
        const recentMovements = Movements.getRecent(5);

        // Update metrics
        document.getElementById('total-products').textContent = products.length;
        document.getElementById('total-value').textContent = `R ${totalValue.toFixed(2)}`;
        document.getElementById('total-sales').textContent = `R ${totalSales.toFixed(2)}`;
        document.getElementById('low-stock-count').textContent = lowStock.length;
        document.getElementById('recent-movements-count').textContent = recentMovements.length;

        // Render low stock items
        const lowStockList = document.getElementById('low-stock-list');
        if (lowStock.length === 0) {
            lowStockList.innerHTML = '<p class="empty-state">No low stock items</p>';
        } else {
            lowStockList.innerHTML = lowStock.map(p => {
                const isCritical = p.quantity === 0;
                return `
                    <div class="low-stock-item ${isCritical ? 'critical' : ''}">
                        <div>
                            <div class="low-stock-name">${p.name}</div>
                            <div class="low-stock-qty">Current: ${p.quantity} | Reorder: ${p.reorderLevel}</div>
                        </div>
                        <span class="badge ${Inventory.getStatusBadge(p)}">${Inventory.getStatusText(p)}</span>
                    </div>
                `;
            }).join('');
        }

        // Render recent activity
        const activityList = document.getElementById('recent-activity');
        if (recentMovements.length === 0) {
            activityList.innerHTML = '<p class="empty-state">No recent activity</p>';
        } else {
            activityList.innerHTML = recentMovements.map(m => `
                <div class="activity-item">
                    <div class="activity-icon ${m.type}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${m.type === 'in'
                    ? '<line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>'
                    : '<line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline>'
                }
                        </svg>
                    </div>
                    <div class="activity-details">
                        <div class="activity-text">
                            <strong>${m.productName}</strong> - ${m.type === 'in' ? '+' : '-'}${m.quantity} units
                        </div>
                        <div class="activity-time">${Movements.formatDate(m.date)}</div>
                    </div>
                </div>
            `).join('');
        }
    },

    // Render inventory
    renderInventory(searchQuery = '') {
        const categoryFilter = document.getElementById('category-filter').value;
        let products = Inventory.getAll();

        // Apply category filter
        if (categoryFilter) {
            products = Inventory.filterByCategory(categoryFilter);
        }

        // Apply search
        if (searchQuery) {
            products = Inventory.search(searchQuery);
        }

        const tbody = document.getElementById('inventory-tbody');

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No products found.</td></tr>';
            return;
        }

        tbody.innerHTML = products.map(p => {
            const stockValue = (p.quantity * p.price).toFixed(2);
            return `
                <tr>
                    <td><strong>${p.name}</strong></td>
                    <td>${p.category}</td>
                    <td>${p.quantity}</td>
                    <td>${p.reorderLevel}</td>
                    <td>R ${p.price.toFixed(2)}</td>
                    <td>R ${stockValue}</td>
                    <td><span class="badge ${Inventory.getStatusBadge(p)}">${Inventory.getStatusText(p)}</span></td>
                    <td>
                        <button class="action-btn action-btn-edit" onclick="App.openProductModal('${p.id}')">Edit</button>
                        <button class="action-btn action-btn-delete" onclick="App.deleteProduct('${p.id}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    // Delete product
    deleteProduct(id) {
        const product = Inventory.getById(id);
        if (!product) return;

        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            Inventory.delete(id);
            this.renderInventory();
            this.renderDashboard();
        }
    },

    // Render movements
    renderMovements(searchQuery = '') {
        let movements = Movements.getAll();
        const tbody = document.getElementById('movements-tbody');

        // Apply search filter
        if (searchQuery) {
            movements = movements.filter(m =>
                m.productName.toLowerCase().includes(searchQuery) ||
                m.reason.toLowerCase().includes(searchQuery) ||
                (m.notes && m.notes.toLowerCase().includes(searchQuery))
            );
        }

        if (movements.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No stock movements found.</td></tr>';
            return;
        }

        tbody.innerHTML = movements.map(m => `
            <tr>
                <td>${Movements.formatDateFull(m.date)}</td>
                <td><strong>${m.productName}</strong></td>
                <td><span class="badge badge-${m.type}">${m.type === 'in' ? 'Stock In' : 'Stock Out'}</span></td>
                <td>${m.type === 'in' ? '+' : '-'}${m.quantity}</td>
                <td>${m.reason}</td>
                <td>${m.notes || '-'}</td>
            </tr>
        `).join('');
    },

    // Render reports
    renderReports() {
        Reports.renderStockSummary();
        Reports.renderMovementSummary();
    },

    // Open material modal
    openMaterialModal(materialId = null) {
        this.editingMaterialId = materialId;
        const modal = document.getElementById('material-modal');
        const title = document.getElementById('material-modal-title');
        const form = document.getElementById('material-form');
        const boxesGroup = document.getElementById('material-boxes-group');
        const quantityHint = document.getElementById('material-quantity-hint');
        const quantityInput = document.getElementById('material-quantity');

        form.reset();
        boxesGroup.style.display = 'none';
        quantityHint.style.display = 'none';
        quantityInput.readOnly = false;
        quantityInput.style.background = '';

        if (materialId) {
            // Edit mode
            title.textContent = 'Edit Raw Material';
            const material = Materials.getById(materialId);
            if (material) {
                document.getElementById('material-name').value = material.name;
                document.getElementById('material-category').value = material.category;

                // Check if this is glass bottles
                const isGlassBottles = material.name.toLowerCase().includes('glass bottle');
                if (isGlassBottles && material.unit === 'pieces') {
                    boxesGroup.style.display = 'block';
                    quantityHint.style.display = 'block';
                    quantityInput.readOnly = true;
                    quantityInput.style.background = '#f5f5f5';

                    // Calculate boxes from pieces
                    const boxes = Math.floor(material.quantity / 12);
                    if (material.quantity % 12 === 0 && boxes > 0) {
                        document.getElementById('material-boxes').value = boxes;
                    }
                }

                document.getElementById('material-quantity').value = material.quantity;
                document.getElementById('material-unit').value = material.unit;
                document.getElementById('material-cost').value = material.unitCost;
                document.getElementById('material-supplier').value = material.supplier || '';
                document.getElementById('material-notes').value = material.notes || '';
            }
        } else {
            // Add mode
            title.textContent = 'Add Raw Material';
        }

        modal.classList.add('active');
        document.getElementById('overlay').classList.add('active');
    },

    // Close material modal
    closeMaterialModal() {
        document.getElementById('material-modal').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
        this.editingMaterialId = null;
    },

    // Handle material form submit
    handleMaterialSubmit() {
        const formData = {
            name: document.getElementById('material-name').value,
            category: document.getElementById('material-category').value,
            quantity: document.getElementById('material-quantity').value,
            unit: document.getElementById('material-unit').value,
            unitCost: document.getElementById('material-cost').value,
            supplier: document.getElementById('material-supplier').value,
            notes: document.getElementById('material-notes').value
        };

        if (this.editingMaterialId) {
            Materials.update(this.editingMaterialId, formData);
        } else {
            Materials.add(formData);
        }

        this.closeMaterialModal();
        this.renderMaterials();
    },

    // Render materials
    renderMaterials(searchQuery = '') {
        let materials = Materials.getAll();
        const tbody = document.getElementById('materials-tbody');

        // Apply search filter
        if (searchQuery) {
            materials = materials.filter(m =>
                m.name.toLowerCase().includes(searchQuery) ||
                m.category.toLowerCase().includes(searchQuery) ||
                (m.supplier && m.supplier.toLowerCase().includes(searchQuery))
            );
        }

        if (materials.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No materials found.</td></tr>';
            return;
        }

        tbody.innerHTML = materials.map(m => {
            const totalValue = (m.quantity * m.unitCost).toFixed(2);
            return `
                <tr>
                    <td><strong>${m.name}</strong></td>
                    <td>${m.category}</td>
                    <td>${m.quantity}</td>
                    <td>${m.unit}</td>
                    <td>R ${m.unitCost.toFixed(2)}</td>
                    <td>R ${totalValue}</td>
                    <td>${m.supplier || '-'}</td>
                    <td>
                        <button class="action-btn action-btn-edit" onclick="App.openMaterialModal('${m.id}')">Edit</button>
                        <button class="action-btn action-btn-delete" onclick="App.deleteMaterial('${m.id}')">Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    // Delete material
    deleteMaterial(id) {
        const material = Materials.getById(id);
        if (!material) return;

        if (confirm(`Are you sure you want to delete "${material.name}"?`)) {
            Materials.delete(id);
            this.renderMaterials();
        }
    },

    // Open material movement modal
    openMaterialMovementModal(type) {
        const modal = document.getElementById('material-movement-modal');
        const title = document.getElementById('material-movement-modal-title');
        const form = document.getElementById('material-movement-form');
        const materialSelect = document.getElementById('material-movement-material');

        form.reset();
        document.getElementById('material-movement-type').value = type;

        title.textContent = type === 'in' ? 'Record Material Stock In' : 'Record Material Stock Out';

        // Populate material dropdown
        const materials = Materials.getAll();
        materialSelect.innerHTML = '<option value="">Select Material</option>';
        materials.forEach(m => {
            materialSelect.innerHTML += `<option value="${m.id}">${m.name} (${m.unit})</option>`;
        });

        // Set current date/time
        const now = new Date();
        const dateString = now.toISOString().slice(0, 16);
        document.getElementById('material-movement-date').value = dateString;

        modal.classList.add('active');
        document.getElementById('overlay').classList.add('active');
    },

    // Close material movement modal
    closeMaterialMovementModal() {
        document.getElementById('material-movement-modal').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    },

    // Handle material movement form submit
    handleMaterialMovementSubmit() {
        const formData = {
            materialId: document.getElementById('material-movement-material').value,
            type: document.getElementById('material-movement-type').value,
            quantity: document.getElementById('material-movement-quantity').value,
            reason: document.getElementById('material-movement-reason').value,
            date: document.getElementById('material-movement-date').value,
            notes: document.getElementById('material-movement-notes').value
        };

        MaterialMovements.add(formData);
        this.closeMaterialMovementModal();
        this.renderMaterialMovements();
        this.renderMaterials();
    },

    // Render material movements
    renderMaterialMovements(searchQuery = '') {
        let movements = MaterialMovements.getAll();
        const tbody = document.getElementById('material-movements-tbody');

        // Apply search filter
        if (searchQuery) {
            movements = movements.filter(m =>
                m.materialName.toLowerCase().includes(searchQuery) ||
                m.reason.toLowerCase().includes(searchQuery) ||
                (m.notes && m.notes.toLowerCase().includes(searchQuery))
            );
        }

        if (movements.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No material movements recorded yet.</td></tr>';
            return;
        }

        tbody.innerHTML = movements.map(m => `
            <tr>
                <td>${MaterialMovements.formatDateFull(m.date)}</td>
                <td><strong>${m.materialName}</strong></td>
                <td><span class="badge badge-${m.type}">${m.type === 'in' ? 'Stock In' : 'Stock Out'}</span></td>
                <td>${m.type === 'in' ? '+' : '-'}${m.quantity} ${m.unit}</td>
                <td>${m.reason}</td>
                <td>${m.notes || '-'}</td>
            </tr>
        `).join('');
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for Firebase to initialize first
    if (window.Storage) {
        await App.init();
    } else {
        // If Storage isn't ready yet, wait a bit
        setTimeout(async () => {
            await App.init();
        }, 500);
    }
});
