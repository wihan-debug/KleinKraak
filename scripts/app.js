/**
 * KleinKraak E-commerce Logic
 * Consolidated for local file system compatibility (no server required).
 */

// ==========================================
// 1. PRODUCT DATA (Admin: Edit this list to change products)
// ==========================================
const products = [
    {
        id: 'white-wine-vinegar',
        name: 'White Wine Vinegar',
        price: 150.00,
        size: '455ml Bottle',
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
        price: 120.00,
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
        price: 120.00,
        size: '455ml Bottle',
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
        price: 120.00,
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
        price: 120.00,
        size: '455ml Bottle',
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
        price: 50.00,
        size: '250g Punnet',
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

        return `
        <article class="product-card" data-id="${product.id}">
            <div class="product-image-container">
                ${imagesHtml}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">R ${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    Add to Cart
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
}

function closeCheckout() {
    checkoutModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
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
function updateCheckoutSummary() {
    const subtotal = cart.getTotal();
    const deliveryMethod = document.querySelector('input[name="delivery"]:checked').value;
    let deliveryCost = 0.00;

    if (deliveryMethod === 'delivery_gauteng') {
        deliveryCost = 200.00;
    }

    const total = subtotal + deliveryCost;

    checkoutSubtotal.textContent = `R ${subtotal.toFixed(2)}`;

    if (deliveryMethod === 'delivery_quote') {
        checkoutDelivery.textContent = "To Be Quoted";
    } else {
        checkoutDelivery.textContent = `R ${deliveryCost.toFixed(2)}`;
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

        const numericTotal = cart.getTotal() + deliveryCost;

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
            total: `R ${numericTotal.toFixed(2)}${deliveryMethodValue === 'delivery_quote' ? ' + Delivery Quote' : ''}`
        };

        const proceedToPayment = () => {
            const confirmMessage = `Order Total: ${formData.total}\n\nClick OK to open the secure Yoco payment page.`;
            if (confirm(confirmMessage)) {
                cart.clear();
                closeCheckout();
                const cleanTotal = numericTotal.toFixed(2); // Use number directly
                const finalLink = `${YOCO_LINK}?amount=${cleanTotal}`;
                window.open(finalLink, '_blank');
            }
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        };

        // Check availability of EmailJS
        if (typeof emailjs === 'undefined') {
            console.warn("EmailJS not loaded");
            proceedToPayment();
            return;
        }

        // 2. Send Emails (Admin + Customer)
        const sendAdmin = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: `Method: ${formData.deliveryMethod}\nAddress: ${formData.address}`,
            total: formData.total,
            cart_details: formData.cart_details
        });

        const sendCustomer = emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CUSTOMER_TEMPLATE_ID, {
            name: formData.name,
            email: formData.email, // Important: Customer email
            phone: formData.phone,
            message: "Thank you for your order! We will be in touch.",
            total: formData.total,
            cart_details: formData.cart_details
        });

        Promise.all([sendAdmin, sendCustomer])
            .then(() => {
                alert("Order placed successfully! Check your email.");
                proceedToPayment();
            })
            .catch((error) => {
                console.error('Email failed:', error);
                // Don't block sales on email failure
                alert("Order received! (Note: Confirmation email might be delayed). Proceeding to payment...");
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
