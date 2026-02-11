import { renderProducts } from './products.js';
import { Cart } from './cart.js';

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

// Initialize State
const cart = new Cart(updateCartUI);

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('product-grid', (product) => {
        cart.add(product);
        openCart();
    });
    updateCartUI(cart);
});

// UI Logic
function openCart() {
    cartDrawer.classList.add('open');
    overlay.classList.add('active');
}

function closeCart() {
    cartDrawer.classList.remove('open');
    overlay.classList.remove('active');
}

function openCheckout() {
    closeCart(); // Close drawer first
    updateCheckoutSummary();
    checkoutModal.classList.add('active');
    overlay.classList.add('active'); // Keep overlay active
}

function closeCheckout() {
    checkoutModal.classList.remove('active');
    overlay.classList.remove('active');
}

// Event Listeners
cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', () => {
    closeCart();
    closeCheckout();
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
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
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

// Checkout Logic
function updateCheckoutSummary() {
    const subtotal = cart.getTotal();
    const deliveryMethod = document.querySelector('input[name="delivery"]:checked').value;
    let deliveryCost = 0;

    if (deliveryMethod === 'delivery_gauteng') {
        if (subtotal >= 500) {
            deliveryCost = 0;
        } else {
            deliveryCost = 200.00;
        }
    }

    const total = subtotal + deliveryCost;

    checkoutSubtotal.textContent = `R ${subtotal.toFixed(2)}`;
    checkoutDelivery.textContent = `R ${deliveryCost.toFixed(2)}`;
    checkoutTotal.textContent = `R ${total.toFixed(2)}`;
}

deliveryInputs.forEach(input => {
    input.addEventListener('change', updateCheckoutSummary);
});

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your order! This is a demo site, so no payment was processed.');
    cart.clear();
    closeCheckout();
});
