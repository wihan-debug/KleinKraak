/**
 * KleinKraak E-commerce Logic
 * Consolidated for local file system compatibility (no server required).
 */

// ==========================================
// 1. PRODUCT DATA (Admin: Edit this list to change products)
// ==========================================

// CONVERSION OPTIMIZATION: Scarcity & Urgency System
const URGENCY_CONFIG = {
    stockMin: 5,
    stockMax: 25,
    viewersMin: 3,
    viewersMax: 15,
    recentPurchaseNames: [
        'Johan from Pretoria', 'Sarah from Johannesburg', 'Thabo from Sandton',
        'Maria from Cape Town', 'David from Centurion', 'Lisa from Midrand',
        'Peter from Randburg', 'Anna from Roodepoort', 'James from Boksburg'
    ]
};

// Generate random stock levels for each product (persisted in localStorage)
function getStockLevel(productId) {
    const key = `stock_${productId}`;
    let stock = localStorage.getItem(key);
    if (!stock) {
        stock = Math.floor(Math.random() * (URGENCY_CONFIG.stockMax - URGENCY_CONFIG.stockMin + 1)) + URGENCY_CONFIG.stockMin;
        localStorage.setItem(key, stock);
    }
    return parseInt(stock);
}

// Generate current viewers count (randomized)
function getViewersCount() {
    return Math.floor(Math.random() * (URGENCY_CONFIG.viewersMin - URGENCY_CONFIG.viewersMax + 1)) + URGENCY_CONFIG.viewersMin;
}

// Show recent purchase notification
function showRecentPurchaseNotification() {
    const notification = document.createElement('div');
    notification.className = 'recent-purchase-notification';
    const randomName = URGENCY_CONFIG.recentPurchaseNames[Math.floor(Math.random() * URGENCY_CONFIG.recentPurchaseNames.length)];
    const randomMinutes = Math.floor(Math.random() * 45) + 5;

    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🎉</span>
            <span class="notification-text"><strong>${randomName}</strong> ordered ${randomMinutes} minutes ago</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 8000);
}

// Trigger purchase notifications periodically
if (document.getElementById('product-grid')) {
    setTimeout(() => showRecentPurchaseNotification(), 5000);
    setInterval(() => showRecentPurchaseNotification(), 45000);
}

const products = [
    {
        id: 'white-wine-vinegar',
        name: 'White Wine Vinegar',
        price: 120.00,
        size: '455ml Bottle',
        bestSeller: true,
        // Uses images array for slideshow
        images: [
            './assets/products/vinegar/1.jpg',
            './assets/products/vinegar/2.jpg',
            './assets/products/vinegar/3.jpg',
            './assets/products/vinegar/4.jpg',
            './assets/products/vinegar/5.jpg'
        ],
        // Fallback for logic that might expect single image
        image: './assets/products/vinegar/1.jpg',
        description: 'White Wine Vinegar infused with salt, sugar, fresh dill, spearmint leaves, peppercorns, coriander, garlic, and grape leaves.',
        ingredients: [
            'White Wine Vinegar',
            'Salt',
            'Sugar',
            'Fresh Dill',
            'Spearmint Leaves',
            'Peppercorns',
            'Coriander',
            'Garlic',
            'Grape Leaves'
        ]
    },
    {
        id: 'spicy-pickled',
        name: 'Spicy Pickled Cucamelons',
        price: 96.00,
        size: '455ml Bottle',
        images: [
            './assets/products/spicy-pickled/1.jpg',
            './assets/products/spicy-pickled/2.jpg',
            './assets/products/spicy-pickled/3.jpg',
            './assets/products/spicy-pickled/4.jpg'
        ],
        image: './assets/products/spicy-pickled/1.jpg',
        description: 'Crunchy cucamelons pickled with a kick of chilli and garlic.',
        ingredients: [
            'Dill',
            'Garlic',
            'Coriander Seeds',
            'Kosher Salt',
            'Mustard Seeds',
            'Vinegar',
            'Water',
            'Grape Leaves',
            'Chilli Flakes'
        ]
    },
    {
        id: 'dill-pickled',
        name: 'Dill & Garlic Pickled Cucamelons',
        price: 96.00,
        size: '455ml Bottle',
        bestSeller: true,
        images: [
            './assets/products/dill-pickled/1.jpg',
            './assets/products/dill-pickled/2.jpg',
            './assets/products/dill-pickled/3.jpg',
            './assets/products/dill-pickled/4.jpg'
        ],
        image: './assets/products/dill-pickled/1.jpg',
        description: 'Classic dill flavor, perfect for salads and cheeseboards.',
        ingredients: [
            'Dill',
            'Garlic',
            'Coriander Seeds',
            'Kosher Salt',
            'Mustard Seeds',
            'Vinegar',
            'Water',
            'Grape Leaves'
        ]
    },
    {
        id: 'sweet-sour',
        name: 'Sweet & Sour Pickled Cucamelons',
        price: 96.00,
        size: '455ml Bottle',
        images: [
            './assets/products/sweet-sour/1.jpg',
            './assets/products/sweet-sour/2.jpg',
            './assets/products/sweet-sour/3.jpg',
            './assets/products/sweet-sour/4.jpg',
            './assets/products/sweet-sour/5.jpg'
        ],
        image: './assets/products/sweet-sour/1.jpg',
        description: 'A delightful balance of sweet and tangy flavors.',
        ingredients: [
            'Dill',
            'Garlic',
            'Coriander Seeds',
            'Kosher Salt',
            'Sugar',
            'Mustard Seeds',
            'Vinegar',
            'Water',
            'Grape Leaves'
        ]
    },
    {
        id: 'sweet-cucamelon',
        name: 'Sweet Cucamelon',
        price: 96.00,
        size: '455ml Bottle',
        inStock: false,
        images: [
            './assets/products/sweet-cucamelon/1.jpg',
            './assets/products/sweet-cucamelon/2.jpg',
            './assets/products/sweet-cucamelon/3.jpg'
        ],
        image: './assets/products/sweet-cucamelon/1.jpg',
        description: 'A unique twist with a sweet kick from Drink-O-Pop powder.',
        ingredients: [
            'Dill',
            'Garlic',
            'Coriander Seeds',
            'Kosher Salt',
            'Sugar',
            'Mustard Seeds',
            'Vinegar',
            'Water',
            'Drink-O-Pop Powder'
        ]
    },
    {
        id: 'fresh-punnet',
        name: 'Fresh Cucamelons (250g)',
        price: 40.00,
        size: '250g Punnet',
        bestSeller: true,
        images: [
            './assets/products/fresh/1.jpg',
            './assets/products/fresh/2.jpg',
            './assets/products/fresh/3.jpg',
            './assets/products/fresh/4.jpg',
            './assets/products/fresh/5.jpg',
            './assets/products/fresh/6.jpg',
            './assets/products/fresh/7.jpg'
        ],
        image: './assets/products/fresh/1.jpg',
        description: 'Freshly harvested cucamelons, perfect for snacking.',
        ingredients: null
    },
    {
        id: 'sweet-spicy-pickled',
        name: 'Pickled Sweet&Spicy',
        price: 120.00,
        size: '455ml Bottle',
        images: [
            './assets/products/spicy-pickled/2.jpg',
            './assets/products/sweet-sour/6.jpg',
            './assets/products/dill-pickled/3.jpg',
            './assets/products/sweet-sour/7.jpg'
        ],
        image: './assets/products/spicy-pickled/2.jpg',
        description: 'A perfect blend of sweet and spicy flavors.',
        ingredients: [
            'Cucamelons',
            'Sugar',
            'Chilli Flakes',
            'Garlic',
            'Vinegar',
            'Water',
            'Coriander Seeds',
            'Mustard Seeds',
            'Salt'
        ]
    },
    {
        id: 'apple-cider-vinegar',
        name: 'Pickled Apple Cider Vinegar',
        price: 130.00,
        size: '455ml Bottle',
        images: [
            './assets/products/vinegar/3.jpg',
            './assets/products/dill-pickled/2.jpg',
            './assets/products/vinegar/4.jpg',
            './assets/products/sweet-sour/3.jpg'
        ],
        image: './assets/products/vinegar/3.jpg',
        description: 'Cucamelons pickled in apple cider vinegar with fresh herbs.',
        ingredients: [
            'Apple Cider Vinegar',
            'Coriander Seeds',
            'Black Peppercorns',
            'Sugar',
            'Dill',
            'Garlic',
            'Grape Leaves'
        ]
    },
    {
        id: 'pickled-mix',
        name: 'Pickled Mix',
        price: 80.00,
        size: '455ml Bottle',
        images: [
            './assets/products/sweet-sour/5.jpg',
            './assets/products/spicy-pickled/3.jpg',
            './assets/products/dill-pickled/4.jpg',
            './assets/products/vinegar/2.jpg'
        ],
        image: './assets/products/sweet-sour/5.jpg',
        description: 'A mix of our favorite pickled varieties in one jar.',
        ingredients: [
            'Mixed Cucamelons',
            'Vinegar',
            'Salt',
            'Sugar',
            'Garlic',
            'Mixed Herbs',
            'Spices'
        ]
    }
];

// ==========================================
// 2. CART LOGIC
// ==========================================
class Cart {
    constructor(updateUiCallback) {
        this.items = JSON.parse(localStorage.getItem('kleinkraak-cart')) || [];
        this.updateUiCallback = updateUiCallback;
    }

    add(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            this.items.push({ ...product, qty: 1 });
        }
        this.save();
        this.updateUiCallback(this);
    }

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateUiCallback(this);
    }

    changeQty(productId, delta) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                this.remove(productId);
            } else {
                this.save();
                this.updateUiCallback(this);
            }
        }
    }

    clear() {
        this.items = [];
        this.save();
        this.updateUiCallback(this);
    }

    save() {
        localStorage.setItem('kleinkraak-cart', JSON.stringify(this.items));
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    getCount() {
        return this.items.reduce((sum, item) => sum + item.qty, 0);
    }
}

// ==========================================
// 3. APP LOGIC & RENDERING
// ==========================================

// DOM Elements
const cartBtn = document.getElementById('cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const closeCartBtn = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total-price');
const cartCountEl = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutBtn = document.getElementById('close-checkout');

const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutDelivery = document.getElementById('checkout-delivery');
const checkoutTotal = document.getElementById('checkout-total');
const checkoutForm = document.getElementById('checkout-form');
const deliveryInputs = document.querySelectorAll('input[name="delivery"]');

// Product Modal Elements
const productModal = document.getElementById('product-modal');
const closeProductModalBtn = document.getElementById('close-product-modal');
const modalProductContainer = document.getElementById('modal-product-container');

// Payment Modal Elements
const paymentModal = document.getElementById('payment-modal');
const closePaymentBtn = document.getElementById('close-payment-modal');
const paymentIframe = document.getElementById('payment-iframe');
const paymentLoading = document.querySelector('.payment-loading');

// Debug: Log if payment modal elements are found
console.log('Payment Modal Elements Check:');
console.log('- paymentModal:', paymentModal ? 'Found' : 'NOT FOUND');
console.log('- closePaymentBtn:', closePaymentBtn ? 'Found' : 'NOT FOUND');
console.log('- paymentIframe:', paymentIframe ? 'Found' : 'NOT FOUND');
console.log('- paymentLoading:', paymentLoading ? 'Found' : 'NOT FOUND');


// Initialize Cart
const cart = new Cart(updateCartUI);

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check if elements exist before using them to avoid errors on non-product pages
    if (document.getElementById('product-grid')) {
        renderProducts('product-grid');
    }
    updateCartUI(cart);
});

// Render Products Function
function renderProducts(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = products.map(product => {
        // Prepare images for slideshow
        // If product.images exists, use it. Otherwise use product.image as an array.
        const imageList = product.images || [product.image];

        // Create IMG tags for each image
        // First one is visible, others are hidden/preloaded
        const imagesHtml = imageList.map((src, index) => `
            <img src="${src}" 
                 alt="${product.name}" 
                 class="product-image ${index === 0 ? '' : 'hidden'}" 
                 ${index === 0 ? 'loading="lazy"' : ''}
                 data-index="${index}">
        `).join('');

        // CONVERSION OPTIMIZATION: Urgency & Scarcity Elements
        const stockLevel = getStockLevel(product.id);
        const isLowStock = stockLevel <= 14;
        const stockBadge = product.inStock !== false && isLowStock
            ? `<div class="stock-badge low-stock">Only ${stockLevel} left!</div>`
            : '';

        const bestSellerBadge = product.bestSeller
            ? '<div class="best-seller-badge">⭐ Best Seller</div>'
            : '';

        const outOfStockBadge = product.inStock === false
            ? '<div class="out-of-stock-badge">Out of Stock</div>'
            : '';

        const disabledClass = product.inStock === false ? 'disabled' : '';

        // Rating display (5 stars for all for now)
        const ratingHtml = product.inStock !== false
            ? `<div class="product-rating">
                <span class="stars">⭐⭐⭐⭐⭐</span>
                <span class="rating-count">(${Math.floor(Math.random() * 30) + 20})</span>
               </div>`
            : '';

        // Improved CTA text
        let ctaText = 'Add to Cart';
        let ctaClass = 'add-to-cart-btn';

        if (product.inStock === false) {
            ctaText = 'Out of Stock';
        } else if (isLowStock) {
            ctaText = 'Add to Cart - Selling Fast! ⚡';
            ctaClass += ' urgent';
        } else {
            ctaText = 'Add to Cart 🛒';
        }

        return `
        <article class="product-card ${disabledClass}" data-id="${product.id}">
            <div class="product-image-container">
                ${imagesHtml}
                ${bestSellerBadge}
                ${stockBadge}
                ${outOfStockBadge}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                ${ratingHtml}
                <p class="product-price">R ${product.price.toFixed(2)}</p>
                <p class="product-size">${product.size}</p>
                <button class="${ctaClass}" data-id="${product.id}" ${product.inStock === false ? 'disabled' : ''}>
                    ${ctaText}
                </button>
            </div>
        </article>
        `;
    }).join('');

    // Attach Slideshow Listeners (Hover cycle)
    container.querySelectorAll('.product-card').forEach(card => {
        const images = card.querySelectorAll('.product-image');
        if (images.length > 1) {
            let interval;
            let currentIndex = 0;

            card.addEventListener('mouseenter', () => {
                // Cycle images every 2.5 seconds
                interval = setInterval(() => {
                    images[currentIndex].classList.add('hidden');
                    currentIndex = (currentIndex + 1) % images.length;
                    images[currentIndex].classList.remove('hidden');
                }, 2500);
            });

            card.addEventListener('mouseleave', () => {
                clearInterval(interval);
                // Reset to first image
                images[currentIndex].classList.add('hidden');
                currentIndex = 0;
                images[currentIndex].classList.remove('hidden');
            });
        }

        // Attach click listener to Card for Modal (ignoring Add Button)
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) return;
            // Get product ID
            const productId = card.dataset.id;
            const product = products.find(p => p.id === productId);
            if (product) {
                openProductDetails(product);
            }
        });
    });

    // Attach Add to Cart listeners
    container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent modal opening
            const productId = btn.dataset.id;
            const product = products.find(p => p.id === productId);
            if (product) {
                cart.add(product);

                // CONVERSION OPTIMIZATION: Success feedback
                const originalText = btn.textContent;
                btn.textContent = '✓ Added!';
                btn.style.background = '#2E7D32';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 1500);

                openCart();
            }
        });
    });
}

// Product Modal Logic
function openProductDetails(product) {
    // Populate Modal
    const ingredientsHtml = product.ingredients
        ? `<div class="modal-ingredients">
            <h4>Ingredients</h4>
            <p>${product.ingredients.join(', ')}</p>
           </div>`
        : '';

    // Use the first image for the modal
    const mainImage = (product.images && product.images.length > 0) ? product.images[0] : product.image;

    modalProductContainer.innerHTML = `
        <img src="${mainImage}" alt="${product.name}" class="modal-product-image">
        <div class="modal-product-info">
            <h2>${product.name}</h2>
            ${product.size ? `<p style="color: #666; margin-top: -5px; margin-bottom: 10px; font-weight: 500;">${product.size}</p>` : ''}
            <p class="price" style="font-size: 1.5rem; color: var(--primary-color); margin: 10px 0;">R ${product.price.toFixed(2)}</p>
            <p class="description">${product.description}</p>
            ${ingredientsHtml}
            <button class="btn btn-primary" id="modal-add-to-cart" style="margin-top:20px;">Add to Cart</button>
        </div>
    `;

    // Attach listener to new Add button
    document.getElementById('modal-add-to-cart').addEventListener('click', () => {
        cart.add(product);
        closeProductDetails();
        openCart();
    });

    productModal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock Body Scroll
}

function closeProductDetails() {
    productModal.classList.remove('active');
    // Only remove overlay if cart/checkout aren't open
    if (!cartDrawer.classList.contains('open') && !checkoutModal.classList.contains('active')) {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Unlock Body Scroll
    }
}

if (closeProductModalBtn) {
    closeProductModalBtn.addEventListener('click', closeProductDetails);
}

// UI State Management
function openCart() {
    cartDrawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartDrawer.classList.remove('open');
    if (!checkoutModal.classList.contains('active') && !productModal.classList.contains('active')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openCheckout() {
    closeCart(); // Close drawer first
    updateCheckoutSummary();
    checkoutModal.classList.add('active');
    overlay.classList.add('active'); // Keep overlay active
    document.body.style.overflow = 'hidden';

    // Attach promo code button listener (needs to be done after modal is active)
    const applyPromoBtn = document.getElementById('apply-promo-btn');
    const promoCodeInput = document.getElementById('promo-code');
    const promoMessage = document.getElementById('promo-message');

    if (applyPromoBtn && promoCodeInput && !applyPromoBtn.dataset.listenerAttached) {
        applyPromoBtn.dataset.listenerAttached = 'true';
        applyPromoBtn.addEventListener('click', () => {
            const code = promoCodeInput.value.trim().toUpperCase();
            const emailInput = document.getElementById('email');
            const customerEmail = emailInput.value.trim().toLowerCase();

            // Validate email is filled first
            if (!customerEmail || !emailInput.validity.valid) {
                promoMessage.textContent = '⚠️ Please enter your email address first';
                promoMessage.style.color = '#ff6f00';
                promoMessage.style.display = 'block';
                emailInput.focus();
                return;
            }

            if (!code) {
                promoMessage.textContent = 'Please enter a promo code';
                promoMessage.style.color = '#d50000';
                promoMessage.style.display = 'block';
                return;
            }

            if (PROMO_CODES[code]) {
                // Check if this email has already used this code
                const usedCodes = JSON.parse(localStorage.getItem('kleinkraak-promo-usage') || '{}');
                const emailKey = customerEmail;
                const userCodes = usedCodes[emailKey] || [];

                if (userCodes.includes(code)) {
                    promoMessage.textContent = '✗ You have already used this promo code';
                    promoMessage.style.color = '#d50000';
                    promoMessage.style.display = 'block';
                    return;
                }

                // Apply the code
                appliedPromoCode = code;
                promoMessage.textContent = `✓ ${PROMO_CODES[code].description} applied!`;
                promoMessage.style.color = '#2E7D32';
                promoMessage.style.display = 'block';
                promoCodeInput.disabled = true;
                applyPromoBtn.textContent = 'Applied';
                applyPromoBtn.disabled = true;
                applyPromoBtn.style.opacity = '0.6';
                updateCheckoutSummary();

                // Save that this email used this code (will be finalized on successful checkout)
                // Note: This is saved immediately to prevent multiple attempts, but could be cleared if checkout fails
                userCodes.push(code);
                usedCodes[emailKey] = userCodes;
                localStorage.setItem('kleinkraak-promo-usage', JSON.stringify(usedCodes));
            } else {
                promoMessage.textContent = '✗ Invalid promo code';
                promoMessage.style.color = '#d50000';
                promoMessage.style.display = 'block';
            }
        });
    }
}

function closeCheckout() {
    checkoutModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Payment Modal Functions
function openPaymentModal(paymentUrl) {
    console.log('>>>>>>> ENTERING openPaymentModal <<<<<<<');
    console.log('URL:', paymentUrl);

    try {
        // Step 1: Check elements exist
        console.log('STEP 1: Checking elements...');
        console.log('- paymentModal:', paymentModal);
        console.log('- paymentIframe:', paymentIframe);
        console.log('- paymentLoading:', paymentLoading);

        if (!paymentModal) {
            console.error('❌ Payment modal element is NULL!');
            throw new Error('Payment modal not initialized');
        }
        console.log('✓ Payment modal element found');

        // Step 2: Add active class
        console.log('STEP 2: Adding active class to modal...');
        paymentModal.classList.add('active');
        console.log('✓ Active class added. Modal classes:', paymentModal.className);

        // Step 3: Hide body scroll
        console.log('STEP 3: Hiding body scroll...');
        document.body.style.overflow = 'hidden';
        console.log('✓ Body scroll hidden');

        // Step 4: Show loading
        console.log('STEP 4: Showing loading spinner...');
        if (paymentLoading) {
            paymentLoading.style.display = 'block';
            console.log('✓ Loading spinner shown');
        } else {
            console.warn('⚠ paymentLoading is null');
        }

        // Step 5: Setup iframe
        console.log('STEP 5: Setting up iframe...');
        if (paymentIframe) {
            paymentIframe.style.display = 'none';
            paymentIframe.classList.remove('loaded');
            console.log('✓ Iframe hidden and loaded class removed');

            // Set iframe source
            console.log('STEP 6: Setting iframe src...');
            paymentIframe.src = paymentUrl;
            console.log('✓ Iframe src set to:', paymentIframe.src);

            // Hide loading when iframe loads
            paymentIframe.onload = function () {
                console.log('📥 IFRAME LOADED!');
                if (paymentLoading) {
                    paymentLoading.style.display = 'none';
                    console.log('✓ Loading hidden');
                }
                paymentIframe.style.display = 'block';
                paymentIframe.classList.add('loaded');
                console.log('✓ Iframe now visible with loaded class');
            };
            console.log('✓ Onload handler attached');
        } else {
            console.error('❌ paymentIframe is null!');
        }

        console.log('>>>>>>> Payment modal setup COMPLETE <<<<<<<');
        console.log('Modal computed style display:', window.getComputedStyle(paymentModal).display);

    } catch (error) {
        console.error('❌❌❌ ERROR in openPaymentModal ❌❌❌');
        console.error('Error:', error);
        console.error('Stack:', error.stack);

        // Fallback to opening in new window
        console.log('Attempting fallback to window.open...');
        alert('Modal failed - opening payment in new window...');
        window.open(paymentUrl, '_blank');
    }
}

function closePaymentModal() {
    paymentModal.classList.remove('active');
    document.body.style.overflow = '';

    // Clear iframe after animation
    setTimeout(() => {
        paymentIframe.src = '';
    }, 300);
}


// Event Listeners
cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', () => {
    closeCart();
    closeCheckout();
    closeProductDetails();
});

checkoutBtn.addEventListener('click', openCheckout);
closeCheckoutBtn.addEventListener('click', closeCheckout);

// Payment Modal Listeners
if (closePaymentBtn) {
    closePaymentBtn.addEventListener('click', closePaymentModal);
}


// Cart UI Render
function updateCartUI(cartInstance) {
    cartCountEl.textContent = cartInstance.getCount();
    cartTotalEl.textContent = `R ${cartInstance.getTotal().toFixed(2)}`;

    if (cartInstance.items.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#999; margin-top:20px;">Your cart is empty.</p>';
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
        cartItemsContainer.innerHTML = cartInstance.items.map(item => `
            <div class="cart-item">
                <img src="${(item.images && item.images.length > 0) ? item.images[0] : item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <span class="cart-item-title">${item.name}</span>
                    <span class="cart-item-price">R ${item.price.toFixed(2)}</span>
                    <div class="cart-item-actions">
                        <button class="qty-btn minus" data-id="${item.id}">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn plus" data-id="${item.id}">+</button>
                        <button class="remove-btn" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Attach listeners for dynamic elements
        document.querySelectorAll('.qty-btn.minus').forEach(btn =>
            btn.addEventListener('click', (e) => cart.changeQty(e.target.dataset.id, -1)));

        document.querySelectorAll('.qty-btn.plus').forEach(btn =>
            btn.addEventListener('click', (e) => cart.changeQty(e.target.dataset.id, 1)));

        document.querySelectorAll('.remove-btn').forEach(btn =>
            btn.addEventListener('click', (e) => cart.remove(e.target.dataset.id)));
    }
}

// ==========================================
// 4. CONFIGURATION (Admin: Edit this)
// ==========================================
const YOCO_LINK = "https://pay.yoco.com/KleinKraak";
const EMAILJS_SERVICE_ID = "service_g6v2rb9";
const EMAILJS_TEMPLATE_ID = "template_wrsn1us"; // Admin
const EMAILJS_CUSTOMER_TEMPLATE_ID = "template_gydifo4"; // Customer

// Checkout Logic
let appliedPromoCode = null;
let promoDiscount = 0;

// Promo Code Database
const PROMO_CODES = {
    'FRESH10': { discount: 0.10, description: '10% off' },
    'WELCOME15': { discount: 0.15, description: '15% off first order' }
};

function updateCheckoutSummary() {
    const subtotal = cart.getTotal();
    const deliveryMethod = document.querySelector('input[name="delivery"]:checked').value;
    let deliveryCost = 0.00;

    if (deliveryMethod === 'delivery_gauteng') {
        deliveryCost = 200.00;
    }

    // Calculate discount
    let discountAmount = 0;
    if (appliedPromoCode && PROMO_CODES[appliedPromoCode]) {
        discountAmount = subtotal * PROMO_CODES[appliedPromoCode].discount;
        promoDiscount = discountAmount;
    }

    const total = subtotal - discountAmount + deliveryCost;

    checkoutSubtotal.textContent = `R ${subtotal.toFixed(2)}`;

    if (deliveryMethod === 'delivery_quote') {
        checkoutDelivery.textContent = "To Be Quoted";
    } else {
        checkoutDelivery.textContent = `R ${deliveryCost.toFixed(2)}`;
    }

    // Show discount row if promo applied
    const existingDiscountRow = document.querySelector('.discount-row');
    if (existingDiscountRow) existingDiscountRow.remove();

    if (discountAmount > 0) {
        const deliveryRow = document.querySelector('.checkout-summary .summary-row:nth-child(2)');
        const discountRow = document.createElement('div');
        discountRow.className = 'summary-row discount-row';
        discountRow.style.color = '#2E7D32';
        discountRow.innerHTML = `
            <span>Discount (${appliedPromoCode}):</span>
            <span>- R ${discountAmount.toFixed(2)}</span>
        `;
        deliveryRow.after(discountRow);
    }

    checkoutTotal.textContent = `R ${total.toFixed(2)}${deliveryMethod === 'delivery_quote' ? ' + Delivery' : ''}`;

    // Toggle Address Fields
    const addressGroup = document.getElementById('delivery-address-group');
    const streetInput = document.getElementById('address-street');
    const townInput = document.getElementById('address-town');
    const codeInput = document.getElementById('address-code');

    if (deliveryMethod === 'delivery_gauteng' || deliveryMethod === 'delivery_quote') {
        addressGroup.classList.remove('hidden');
        streetInput.setAttribute('required', 'true');
        townInput.setAttribute('required', 'true');
        codeInput.setAttribute('required', 'true');
    } else {
        addressGroup.classList.add('hidden');
        streetInput.removeAttribute('required');
        townInput.removeAttribute('required');
        codeInput.removeAttribute('required');
    }
}

deliveryInputs.forEach(input => {
    input.addEventListener('change', updateCheckoutSummary);
});

// Checkout Form Logic
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Select submit button
    let submitBtn = checkoutForm.querySelector('button[type="submit"]');
    // Fallback if type=submit isn't found
    if (!submitBtn) submitBtn = checkoutForm.querySelector('.btn-success');

    // Safety check
    if (!submitBtn) {
        alert("System Error: Submit button not found.");
        return;
    }

    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Processing...";
    submitBtn.disabled = true;

    try {
        // 1. Gather Data
        // 1. Gather Data
        const deliveryMethodRadio = document.querySelector('input[name="delivery"]:checked');
        const deliveryMethodValue = deliveryMethodRadio ? deliveryMethodRadio.value : 'collect';

        let deliveryCost = 0.00;
        let deliveryLabel = "Collect";

        if (deliveryMethodValue === 'delivery_gauteng') {
            deliveryCost = 200.00;
            deliveryLabel = "Gauteng Delivery";
        } else if (deliveryMethodValue === 'delivery_quote') {
            deliveryCost = 0.00;
            deliveryLabel = "Outside Gauteng/Intl (Quote Required)";
        }

        // Apply promo discount
        let discountAmount = 0;
        if (appliedPromoCode && PROMO_CODES[appliedPromoCode]) {
            discountAmount = cart.getTotal() * PROMO_CODES[appliedPromoCode].discount;
        }

        const numericTotal = cart.getTotal() - discountAmount + deliveryCost;

        // Construct full address
        const requiresAddress = deliveryMethodValue === 'delivery_gauteng' || deliveryMethodValue === 'delivery_quote';
        const fullAddress = requiresAddress
            ? `${document.getElementById('address-street').value}, ${document.getElementById('address-town').value}, ${document.getElementById('address-code').value}`
            : "Collection (No Address Required)";

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            deliveryMethod: deliveryLabel,
            address: fullAddress,
            cart_details: cart.items.map(i => `${i.qty}x ${i.name} (R${i.price})`).join('\n'),
            promo_code: appliedPromoCode ? `${appliedPromoCode} (${PROMO_CODES[appliedPromoCode].description})` : 'None',
            discount: discountAmount > 0 ? `- R ${discountAmount.toFixed(2)}` : 'R 0.00',
            total: `R ${numericTotal.toFixed(2)}${deliveryMethodValue === 'delivery_quote' ? ' + Delivery Quote' : ''}`
        };

        const proceedToPayment = () => {
            console.log('=== proceedToPayment called ===');
            console.log('Form Data Total:', formData.total);
            console.log('Numeric Total:', numericTotal);

            console.log('Proceeding to payment...');

            // Clear cart and close checkout
            cart.clear();
            console.log('Cart cleared');

            closeCheckout();
            console.log('Checkout closed');

            // Calculate amount for Yoco
            const cleanTotal = numericTotal.toFixed(2);
            const finalLink = `${YOCO_LINK}?amount=${cleanTotal}`;
            console.log('Payment URL:', finalLink);

            // Open payment modal with iframe
            console.log('About to call openPaymentModal...');
            openPaymentModal(finalLink);
            console.log('openPaymentModal called');

            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            console.log('Button reset to:', originalBtnText);
        };

        // Check availability of EmailJS
        if (typeof emailjs === 'undefined') {
            console.warn("EmailJS not loaded");
            proceedToPayment();
            return;
        }

        // Send Admin Notification Only (Customer email sent manually after payment confirmation)
        const adminMessage = `Method: ${formData.deliveryMethod}\nAddress: ${formData.address}\n\n⚠️ PAYMENT PENDING - Customer has opened payment window. Verify payment in Yoco dashboard before fulfilling order.`;

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: adminMessage,
            total: formData.total,
            cart_details: formData.cart_details
        })
            .then(() => {
                console.log('Admin notification sent successfully');
                proceedToPayment();
            })
            .catch((error) => {
                console.error('Email notification failed:', error);
                // Don't block sales on email failure
                proceedToPayment();
            });


    } catch (err) {
        alert("Unexpected System Error: " + err.message);
        console.error(err);
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    }
});
