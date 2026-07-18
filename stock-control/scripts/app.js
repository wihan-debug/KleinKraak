/**
 * KleinKraak Stock Control v2.0
 * Single-file application: Firebase + full CRUD
 * Auth is handled by the main site (admin.js password gate).
 * All data stored under `stockControl/` in Firebase Realtime Database.
 */

/* ============================================================
   FIREBASE INIT
============================================================ */
const _fbConfig = {
    apiKey:            "AIzaSyBLYTt1Wz4AcxDlQtnL374f0ntYuNG6C6U",
    authDomain:        "kleinkraak-49f26.firebaseapp.com",
    databaseURL:       "https://kleinkraak-49f26-default-rtdb.europe-west1.firebasedatabase.app",
    projectId:         "kleinkraak-49f26",
    storageBucket:     "kleinkraak-49f26.firebasestorage.app",
    messagingSenderId: "82607492969",
    appId:             "1:82607492969:web:73ab3ad041ca3cea0337f8"
};

let _db;
try {
    firebase.initializeApp(_fbConfig);
    _db = firebase.database();
} catch (e) {
    console.error("Firebase init failed:", e);
}

/* ============================================================
   UTILITIES
============================================================ */
async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function fmtDate(ts) {
    const d = new Date(ts);
    const date = d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
}

function esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ============================================================
   DB — thin Firebase wrapper
============================================================ */
const DB = {
    async get(path) {
        const snap = await _db.ref(path).once('value');
        return snap.exists() ? snap.val() : null;
    },
    async set(path, val) {
        await _db.ref(path).set(val);
    },
    async update(path, val) {
        await _db.ref(path).update(val);
    },
    async push(path, val) {
        const ref = _db.ref(path).push();
        await ref.set(val);
        return ref.key;
    },
    async remove(path) {
        await _db.ref(path).remove();
    },
    listen(path, cb) {
        _db.ref(path).on('value', snap => cb(snap.exists() ? snap.val() : null));
    }
};

/* ============================================================
   APPLICATION STATE
============================================================ */
const State = {
    defaultThreshold:  5,
    products:          {},   // { [id]: { name, size, category, stock, threshold, retailPrice, createdAt } }
    movements:         {}    // { [id]: { productId, productName, qty, direction, reason, note, timestamp, adjustedStock } }
};

/* ============================================================
   APP
============================================================ */
const App = {

    /* ----------------------------------------------------------
       BOOT
    ---------------------------------------------------------- */
    async init() {
        // Dashboard date
        const el = document.getElementById('dashboard-date');
        if (el) el.textContent = new Date().toLocaleDateString('en-ZA', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });

        // Navigation
        this._setupNav();

        // Skip PIN screen — main site already authenticated the user.
        // Hide pin screen, show app, start loading.
        const pinScreen = document.getElementById('pin-screen');
        const mainApp   = document.getElementById('main-app');
        if (pinScreen) pinScreen.style.display = 'none';
        if (mainApp)   mainApp.style.display   = 'flex';

        // Load threshold setting
        const thr = await DB.get('stockControl/settings/defaultThreshold');
        if (thr !== null) {
            State.defaultThreshold = thr;
            const thrEl = document.getElementById('settings-threshold');
            if (thrEl) thrEl.value = thr;
        }

        this._startListeners();
    },

    /* ----------------------------------------------------------
       LOCK (goes back to main site)
    ---------------------------------------------------------- */
    lock() {
        // Return to main site — the password gate there handles re-auth
        window.location.href = '../index.html';
    },

    /* ----------------------------------------------------------
       REAL-TIME LISTENERS
    ---------------------------------------------------------- */
    _startListeners() {
        DB.listen('stockControl/products', data => {
            State.products = data || {};
            this.renderDashboard();
            this.renderProducts();
        });
        DB.listen('stockControl/movements', data => {
            State.movements = data || {};
            this.renderLog();
        });
    },

    /* ----------------------------------------------------------
       NAVIGATION
    ---------------------------------------------------------- */
    _setupNav() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                this.switchView(item.dataset.view);
                document.getElementById('sidebar').classList.remove('open');
                document.getElementById('sidebar-overlay').classList.remove('open');
            });
        });

        const menuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        menuBtn?.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('open');
        });
        overlay?.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
        });
    },

    switchView(name) {
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        document.querySelector(`[data-view="${name}"]`)?.classList.add('active');
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(`view-${name}`)?.classList.add('active');
    },

    /* ----------------------------------------------------------
       DASHBOARD
    ---------------------------------------------------------- */
    renderDashboard() {
        const entries  = Object.entries(State.products).map(([id, p]) => ({ ...p, _id: id }));
        const total    = entries.length;
        const outList  = entries.filter(p => (p.stock || 0) <= 0);
        const lowList  = entries.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= (p.threshold ?? State.defaultThreshold));
        const okList   = entries.filter(p => (p.stock || 0) > (p.threshold ?? State.defaultThreshold));

        // Total stock value = sum of (stock × retailPrice) for all products
        const totalValue = entries.reduce((sum, p) => sum + ((p.stock || 0) * (p.retailPrice || 0)), 0);
        const fmtVal = 'R\u00A0' + totalValue.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        // Stat cards
        const sg = document.getElementById('stat-grid');
        if (sg) sg.innerHTML = `
            <div class="stat-card blue">
                <div class="stat-label">Total Products</div>
                <div class="stat-value">${total}</div>
                <div class="stat-sub">product lines</div>
            </div>
            <div class="stat-card green">
                <div class="stat-label">In Stock</div>
                <div class="stat-value">${okList.length}</div>
                <div class="stat-sub">above threshold</div>
            </div>
            <div class="stat-card amber">
                <div class="stat-label">Low Stock</div>
                <div class="stat-value">${lowList.length}</div>
                <div class="stat-sub">at or near alert</div>
            </div>
            <div class="stat-card red">
                <div class="stat-label">Out of Stock</div>
                <div class="stat-value">${outList.length}</div>
                <div class="stat-sub">need restocking</div>
            </div>
            <div class="stat-card" style="border-left-color:#7C3AED">
                <div class="stat-label">Stock Value</div>
                <div class="stat-value" style="font-size:1.4rem;color:#7C3AED">${fmtVal}</div>
                <div class="stat-sub">at retail prices</div>
            </div>
        `;

        // Product cards — sort: out first, low next, ok last; then alphabetical
        entries.sort((a, b) => {
            const rank = p => (p.stock || 0) <= 0 ? 0 : (p.stock || 0) <= (p.threshold ?? State.defaultThreshold) ? 1 : 2;
            const diff = rank(a) - rank(b);
            return diff !== 0 ? diff : (a.name || '').localeCompare(b.name || '');
        });

        const grid = document.getElementById('dashboard-grid');
        if (!grid) return;

        if (entries.length === 0) {
            grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
                <div class="empty-icon">📦</div>
                <p>No products yet.<br><a href="#" onclick="App.switchView('products')">Add your first product →</a></p>
            </div>`;
            return;
        }

        grid.innerHTML = entries.map(p => {
            const stock   = p.stock || 0;
            const thr     = p.threshold ?? State.defaultThreshold;
            const isOut   = stock <= 0;
            const isLow   = !isOut && stock <= thr;
            const cls     = isOut ? 'out' : isLow ? 'low' : '';
            const badgeCls = isOut ? 'badge-out' : isLow ? 'badge-low' : 'badge-ok';
            const badgeTxt = isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock';
            return `
            <div class="product-card ${cls}">
                <span class="stock-badge ${badgeCls}">${badgeTxt}</span>
                <div class="product-card-name">${esc(p.name)}</div>
                <div class="product-card-meta">${esc(p.size || '')}${p.size && p.category ? ' · ' : ''}${esc(p.category || '')}</div>
                <div class="product-card-stock">${stock}</div>
                <div class="product-card-unit">bottles / units</div>
                <div class="quick-adjust">
                    <button class="quick-btn minus" onclick="App.quickAdjust('${p._id}', -1)" title="Remove 1">−</button>
                    <button class="quick-btn plus"  onclick="App.quickAdjust('${p._id}',  1)" title="Add 1">+</button>
                </div>
            </div>`;
        }).join('');
    },

    /* ----------------------------------------------------------
       PRODUCTS VIEW
    ---------------------------------------------------------- */
    renderProducts() {
        const tbody   = document.getElementById('products-tbody');
        const emptyEl = document.getElementById('products-empty');
        if (!tbody) return;

        let list = Object.entries(State.products).map(([id, p]) => ({ ...p, _id: id }));

        const search = (document.getElementById('product-search')?.value || '').toLowerCase();
        const cat    = document.getElementById('product-cat-filter')?.value || '';

        if (search) list = list.filter(p =>
            (p.name  || '').toLowerCase().includes(search) ||
            (p.size  || '').toLowerCase().includes(search)
        );
        if (cat) list = list.filter(p => p.category === cat);

        list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

        if (list.length === 0) {
            tbody.innerHTML = '';
            emptyEl.style.display = 'block';
            return;
        }
        emptyEl.style.display = 'none';

        tbody.innerHTML = list.map(p => {
            const stock  = p.stock || 0;
            const thr    = p.threshold ?? State.defaultThreshold;
            const isOut  = stock <= 0;
            const isLow  = !isOut && stock <= thr;
            const sCls   = isOut ? 'out' : isLow ? 'low' : 'ok';
            const price  = p.retailPrice ? 'R\u00A0' + Number(p.retailPrice).toFixed(2) : '—';
            const lineVal = p.retailPrice ? 'R\u00A0' + (stock * p.retailPrice).toFixed(2) : '—';
            return `<tr>
                <td>
                    <div style="font-weight:700;font-size:0.9rem">${esc(p.name)}</div>
                    <div style="font-size:0.76rem;color:var(--text-muted);margin-top:2px">${esc(p.size || '—')}</div>
                </td>
                <td><span class="cat-pill">${esc(p.category || 'Other')}</span></td>
                <td style="color:var(--text-muted);font-size:0.88rem">${thr}</td>
                <td><span class="stock-cell ${sCls}">${stock}</span></td>
                <td style="font-size:0.85rem;color:var(--text-muted)">${price}</td>
                <td style="font-size:0.85rem;font-weight:600">${lineVal}</td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn btn-adjust" onclick="App.openMovementModal('${p._id}')">Adjust</button>
                        <button class="action-btn btn-edit"   onclick="App.openProductModal('${p._id}')">Edit</button>
                        <button class="action-btn btn-delete" onclick="App.deleteProduct('${p._id}')">Delete</button>
                    </div>
                </td>
            </tr>`;
        }).join('');
    },

    /* ----------------------------------------------------------
       LOG VIEW
    ---------------------------------------------------------- */
    renderLog() {
        const tbody   = document.getElementById('log-tbody');
        const emptyEl = document.getElementById('log-empty');
        if (!tbody) return;

        let list = Object.entries(State.movements).map(([id, m]) => ({ ...m, _id: id }));

        const search     = (document.getElementById('log-search')?.value     || '').toLowerCase();
        const dirFilter  = document.getElementById('log-dir-filter')?.value  || '';
        const dateFilter = document.getElementById('log-date-filter')?.value || '';

        if (search) list = list.filter(m =>
            (m.productName || '').toLowerCase().includes(search) ||
            (m.reason || '').toLowerCase().includes(search) ||
            (m.note   || '').toLowerCase().includes(search)
        );
        if (dirFilter) list = list.filter(m => m.direction === dirFilter);
        if (dateFilter) list = list.filter(m => {
            const d  = new Date(m.timestamp);
            const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            return ds === dateFilter;
        });

        list.sort((a, b) => b.timestamp - a.timestamp);

        if (list.length === 0) {
            tbody.innerHTML = '';
            emptyEl.style.display = 'block';
            return;
        }
        emptyEl.style.display = 'none';

        tbody.innerHTML = list.map(m => {
            const sign = m.direction === 'in' ? '+' : '−';
            const note = m.note ? `<br><span style="color:var(--text-muted);font-size:0.76rem">${esc(m.note)}</span>` : '';
            return `<tr>
                <td style="font-size:0.78rem;color:var(--text-muted);white-space:nowrap">${fmtDate(m.timestamp)}</td>
                <td style="font-weight:600;font-size:0.88rem">${esc(m.productName || '—')}</td>
                <td><span class="dir-badge ${m.direction}">${m.direction === 'in' ? '▲ In' : '▼ Out'}</span></td>
                <td><span class="qty-change ${m.direction}">${sign}${m.qty}</span></td>
                <td style="font-size:0.84rem">${esc(m.reason || '—')}${note}</td>
                <td style="font-weight:700">${m.adjustedStock !== undefined ? m.adjustedStock : '—'}</td>
            </tr>`;
        }).join('');
    },

    /* ----------------------------------------------------------
       PRODUCT MODAL
    ---------------------------------------------------------- */
    openProductModal(productId = null) {
        const overlay = document.getElementById('product-modal-overlay');
        const title   = document.getElementById('product-modal-title');
        const osr     = document.getElementById('opening-stock-row');
        const etr     = document.getElementById('edit-threshold-row');

        // Reset
        document.getElementById('product-edit-id').value       = '';
        document.getElementById('product-name').value          = '';
        document.getElementById('product-size').value          = '';
        document.getElementById('product-category').value      = 'Pickled';
        document.getElementById('product-opening-stock').value = '0';
        document.getElementById('product-threshold').value     = String(State.defaultThreshold);
        document.getElementById('product-price').value         = '';

        if (productId && State.products[productId]) {
            const p = State.products[productId];
            title.textContent = 'Edit Product';
            document.getElementById('product-edit-id').value           = productId;
            document.getElementById('product-name').value              = p.name         || '';
            document.getElementById('product-size').value              = p.size         || '';
            document.getElementById('product-category').value          = p.category     || 'Other';
            document.getElementById('product-threshold-edit').value    = String(p.threshold ?? State.defaultThreshold);
            document.getElementById('product-price').value             = p.retailPrice  || '';
            osr.style.display = 'none';
            etr.style.display = '';
        } else {
            title.textContent = 'Add Product';
            osr.style.display = '';
            etr.style.display = 'none';
        }

        overlay.classList.add('open');
        setTimeout(() => document.getElementById('product-name').focus(), 100);
    },

    closeProductModal() {
        document.getElementById('product-modal-overlay').classList.remove('open');
    },

    async saveProduct() {
        const editId      = document.getElementById('product-edit-id').value;
        const name        = document.getElementById('product-name').value.trim();
        const size        = document.getElementById('product-size').value.trim();
        const category    = document.getElementById('product-category').value;
        const retailPrice = parseFloat(document.getElementById('product-price').value) || 0;
        const isNew       = !editId;

        if (!name) { this.toast('Please enter a product name.', 'error'); return; }

        if (isNew) {
            const stock     = parseInt(document.getElementById('product-opening-stock').value) || 0;
            const threshold = parseInt(document.getElementById('product-threshold').value)     || State.defaultThreshold;
            const productId = uid();

            await DB.set(`stockControl/products/${productId}`, {
                name, size, category, stock, threshold, retailPrice, createdAt: Date.now()
            });

            // Log opening stock movement if stock > 0
            if (stock > 0) {
                await this._writeMovement(productId, `${name}${size ? ' (' + size + ')' : ''}`,
                    stock, 'in', 'Opening stock', '', stock);
            }
            this.toast(`${name} added!`, 'success');
        } else {
            const threshold = parseInt(document.getElementById('product-threshold-edit').value) || State.defaultThreshold;
            const editPrice = parseFloat(document.getElementById('product-price').value) || 0;
            await DB.update(`stockControl/products/${editId}`, { name, size, category, threshold, retailPrice: editPrice });
            this.toast(`${name} updated.`, 'success');
        }

        this.closeProductModal();
    },

    async deleteProduct(productId) {
        const p = State.products[productId];
        if (!p) return;
        if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
        await DB.remove(`stockControl/products/${productId}`);
        this.toast(`${p.name} deleted.`, 'warning');
    },

    /* ----------------------------------------------------------
       MOVEMENT MODAL
    ---------------------------------------------------------- */
    openMovementModal(preselect = null) {
        const overlay = document.getElementById('movement-modal-overlay');

        // Reset
        document.getElementById('dir-in').checked = true;
        document.getElementById('mov-qty').value  = '1';
        document.getElementById('mov-note').value = '';

        // Populate product dropdown
        const select   = document.getElementById('mov-product');
        const products = Object.entries(State.products)
            .map(([id, p]) => ({ ...p, _id: id }))
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

        select.innerHTML = `<option value="">Select product…</option>` +
            products.map(p =>
                `<option value="${p._id}" ${p._id === preselect ? 'selected' : ''}>` +
                `${esc(p.name)}${p.size ? ' (' + esc(p.size) + ')' : ''} — ${p.stock || 0} in stock` +
                `</option>`
            ).join('');

        this.updateReasons();
        overlay.classList.add('open');
    },

    closeMovementModal() {
        document.getElementById('movement-modal-overlay').classList.remove('open');
    },

    updateReasons() {
        const dir    = document.querySelector('input[name="mov-dir"]:checked')?.value || 'in';
        const select = document.getElementById('mov-reason');
        const inR  = ['Batch produced', 'Stock correction', 'Returned stock', 'Transfer in', 'Other'];
        const outR = ['Sold — direct', 'Sold — market stall', 'Sold — invoice', 'Damaged / broken', 'Sample / giveaway', 'Stock correction', 'Other'];
        select.innerHTML = (dir === 'in' ? inR : outR).map(r => `<option value="${r}">${r}</option>`).join('');
    },

    async saveMovement() {
        const productId = document.getElementById('mov-product').value;
        const direction = document.querySelector('input[name="mov-dir"]:checked')?.value;
        const qty       = parseInt(document.getElementById('mov-qty').value)    || 0;
        const reason    = document.getElementById('mov-reason').value;
        const note      = document.getElementById('mov-note').value.trim();

        if (!productId) { this.toast('Please select a product.', 'error'); return; }
        if (!qty || qty < 1) { this.toast('Please enter a valid quantity.', 'error'); return; }

        const p = State.products[productId];
        if (!p) { this.toast('Product not found.', 'error'); return; }

        const current  = p.stock || 0;
        const newStock = direction === 'in' ? current + qty : Math.max(0, current - qty);
        const fullName = `${p.name}${p.size ? ' (' + p.size + ')' : ''}`;

        await DB.update(`stockControl/products/${productId}`, { stock: newStock });
        await this._writeMovement(productId, fullName, qty, direction, reason, note, newStock);

        this.toast(`${p.name}: ${direction === 'in' ? '+' : '−'}${qty} → ${newStock}`, 'success');
        this.closeMovementModal();
    },

    async _writeMovement(productId, productName, qty, direction, reason, note, adjustedStock) {
        await DB.push('stockControl/movements', {
            productId,
            productName,
            qty,
            direction,
            reason,
            note: note || '',
            timestamp: Date.now(),
            adjustedStock
        });
    },

    /* ----------------------------------------------------------
       QUICK ADJUST (dashboard ± buttons)
    ---------------------------------------------------------- */
    async quickAdjust(productId, delta) {
        const p = State.products[productId];
        if (!p) return;
        const current  = p.stock || 0;
        const newStock = Math.max(0, current + delta);
        const dir      = delta > 0 ? 'in' : 'out';
        const reason   = delta > 0 ? 'Quick add' : 'Quick remove';
        const fullName = `${p.name}${p.size ? ' (' + p.size + ')' : ''}`;

        await DB.update(`stockControl/products/${productId}`, { stock: newStock });
        await this._writeMovement(productId, fullName, Math.abs(delta), dir, reason, '', newStock);
        this.toast(`${p.name}: ${delta > 0 ? '+' : ''}${delta} → ${newStock}`, 'success');
    },

    /* ----------------------------------------------------------
       SETTINGS
    ---------------------------------------------------------- */
    async changePin() {
        const cur     = document.getElementById('settings-current-pin').value;
        const next    = document.getElementById('settings-new-pin').value;
        const confirm = document.getElementById('settings-confirm-pin').value;

        if (!cur || !next || !confirm) { this.toast('Please fill in all PIN fields.', 'error'); return; }
        if (!/^\d{4}$/.test(next))    { this.toast('New PIN must be exactly 4 digits.', 'error'); return; }
        if (next !== confirm)          { this.toast('New PINs do not match.', 'error'); return; }

        const curHash = await sha256(cur);
        if (curHash !== State.pinHash) { this.toast('Current PIN is incorrect.', 'error'); return; }

        const newHash = await sha256(next);
        await DB.set('stockControl/settings/pin', newHash);
        State.pinHash = newHash;

        ['settings-current-pin','settings-new-pin','settings-confirm-pin'].forEach(id => {
            document.getElementById(id).value = '';
        });
        this.toast('PIN updated successfully!', 'success');
    },


    /* ----------------------------------------------------------
       SEED -- import all catalogue products
    ---------------------------------------------------------- */
    async seedCatalogueProducts() {
        const existing = Object.keys(State.products).length;
        if (existing > 0) {
            if (!confirm(`You already have ${existing} product(s). This will ADD the catalogue products alongside them (nothing deleted). Continue?`)) return;
        }
        const catalogue = [
            { name: 'White Wine Vinegar',               size: '455ml',       category: 'Vinegar',  retailPrice: 150 },
            { name: 'White Wine Vinegar',               size: '230ml',       category: 'Vinegar',  retailPrice:  70 },
            { name: 'Spicy Pickled Cucamelons',         size: '455ml',       category: 'Pickled',  retailPrice: 120 },
            { name: 'Spicy Pickled Cucamelons',         size: '230ml',       category: 'Pickled',  retailPrice:  70 },
            { name: 'Dill & Garlic Pickled Cucamelons', size: '455ml',       category: 'Pickled',  retailPrice: 120 },
            { name: 'Dill & Garlic Pickled Cucamelons', size: '230ml',       category: 'Pickled',  retailPrice:  70 },
            { name: 'Sweet & Sour Pickled Cucamelons',  size: '455ml',       category: 'Pickled',  retailPrice: 120 },
            { name: 'Sweet & Sour Pickled Cucamelons',  size: '230ml',       category: 'Pickled',  retailPrice:  70 },
            { name: 'Pickled Sweet & Spicy',            size: '455ml',       category: 'Pickled',  retailPrice: 120 },
            { name: 'Pickled Sweet & Spicy',            size: '230ml',       category: 'Pickled',  retailPrice:  70 },
            { name: 'Pickled Apple Cider Vinegar',      size: '455ml',       category: 'Pickled',  retailPrice: 120 },
            { name: 'Pickled Apple Cider Vinegar',      size: '230ml',       category: 'Pickled',  retailPrice:  70 },
            { name: 'Sweet Cucamelons',                 size: '455ml',       category: 'Pickled',  retailPrice: 120 },
            { name: 'Sweet Cucamelons',                 size: '230ml',       category: 'Pickled',  retailPrice:  70 },
            { name: 'Sweet & Tangy Pickled Cucamelons', size: '455ml',       category: 'Pickled',  retailPrice: 120 },
            { name: 'Sweet & Tangy Pickled Cucamelons', size: '230ml',       category: 'Pickled',  retailPrice:  70 },
            { name: 'Piccalilli',                       size: '455ml',       category: 'Pickled',  retailPrice: 120 },
            { name: 'Piccalilli',                       size: '230ml',       category: 'Pickled',  retailPrice:  70 },
            { name: 'Salsa',                            size: '455ml',       category: 'Salsa',    retailPrice: 120 },
            { name: 'Salsa',                            size: '230ml',       category: 'Salsa',    retailPrice:  70 },
            { name: 'French Salad Dressing',            size: '455ml',       category: 'Dressing', retailPrice: 120 },
            { name: 'French Salad Dressing',            size: '230ml',       category: 'Dressing', retailPrice:  70 },
            { name: 'Garlic & Herb Salad Dressing',     size: '455ml',       category: 'Dressing', retailPrice: 120 },
            { name: 'Garlic & Herb Salad Dressing',     size: '230ml',       category: 'Dressing', retailPrice:  70 },
            { name: 'Fresh Cucamelons',                 size: '250g Punnet', category: 'Fresh',    retailPrice:  50 }
        ];
        const btn = document.getElementById('seed-btn');
        if (btn) { btn.textContent = 'Importing...'; btn.disabled = true; }
        const thr = State.defaultThreshold || 5;
        for (const p of catalogue) {
            await DB.set(`stockControl/products/${uid()}`, {
                name: p.name, size: p.size, category: p.category,
                retailPrice: p.retailPrice, stock: 0, threshold: thr,
                createdAt: Date.now()
            });
        }
        if (btn) { btn.textContent = 'Import Catalogue Products'; btn.disabled = false; }
        this.toast(`${catalogue.length} products imported! Log your opening stock to get started.`, 'success');
        this.switchView('products');
    },
    async saveThreshold() {
        const val = parseInt(document.getElementById('settings-threshold').value) || 5;
        await DB.set('stockControl/settings/defaultThreshold', val);
        State.defaultThreshold = val;
        this.toast('Default threshold saved.', 'success');
        this.renderDashboard();
        this.renderProducts();
    },

    /* ----------------------------------------------------------
       TOAST
    ---------------------------------------------------------- */
    toast(msg, type = 'success') {
        const c   = document.getElementById('toast-container');
        const el  = document.createElement('div');
        el.className    = `toast ${type}`;
        el.textContent  = msg;
        c.appendChild(el);
        setTimeout(() => {
            el.style.transition = 'opacity 0.3s';
            el.style.opacity    = '0';
            setTimeout(() => el.remove(), 300);
        }, 3200);
    }
};

/* ============================================================
   EXPORT for invoices.html compat + BOOT
============================================================ */
window.App = App;

document.addEventListener('DOMContentLoaded', () => App.init());
