// Promotional Banner Close Functionality
document.addEventListener('DOMContentLoaded', () => {
    const promoBanner = document.getElementById('promo-banner');
    const closePromoBtn = document.getElementById('close-promo-banner');

    // Check if user previously closed the banner
    const promoClosed = localStorage.getItem('kleinkraak-promo-closed');

    if (promoClosed === 'true') {
        promoBanner.classList.add('hidden');
    }

    // Close banner on click
    closePromoBtn?.addEventListener('click', () => {
        promoBanner.classList.add('hidden');
        localStorage.setItem('kleinkraak-promo-closed', 'true');
    });
});

// Social Share Functions
function shareProduct(productName, productPrice) {
    const productUrl = window.location.href;
    const shareText = `Check out ${productName} from KleinKraak! ${productPrice}`;

    return {
        whatsapp: () => {
            const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' - ' + productUrl)}`;
            window.open(url, '_blank');
        },
        facebook: () => {
            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
            window.open(url, '_blank', 'width=600,height=400');
        },
        twitter: () => {
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`;
            window.open(url, '_blank', 'width=600,height=400');
        },
        copyLink: (button) => {
            navigator.clipboard.writeText(productUrl).then(() => {
                const originalText = button.innerHTML;
                button.innerHTML = '✓ Copied!';
                button.classList.add('copied');

                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('copied');
                }, 2000);
            });
        }
    };
}

// Add share buttons to products when modal is opened
function addShareButtonsToModal(productName, productPrice) {
    const modalContainer = document.getElementById('modal-product-container');

    // Check if share buttons already exist
    if (modalContainer && !modalContainer.querySelector('.share-buttons')) {
        const shareButtonsHTML = `
            <div class="share-buttons">
                <button class="share-btn share-btn-whatsapp" onclick="shareProduct('${productName}', '${productPrice}').whatsapp()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.654a11.882 11.882 0 005.713 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                </button>
                <button class="share-btn share-btn-facebook" onclick="shareProduct('${productName}', '${productPrice}').facebook()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                </button>
                <button class="share-btn share-btn-twitter" onclick="shareProduct('${productName}', '${productPrice}').twitter()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                </button>
                <button class="share-btn share-btn-copy" onclick="shareProduct('${productName}', '${productPrice}').copyLink(this)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    Copy Link
                </button>
            </div>
        `;

        // Append share buttons to modal
        modalContainer.insertAdjacentHTML('beforeend', shareButtonsHTML);
    }
}

// Make functions globally available
window.shareProduct = shareProduct;
window.addShareButtonsToModal = addShareButtonsToModal;

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
});

// Newsletter Signup
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');

    newsletterForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';

        try {
            // Check if EmailJS is loaded
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS not loaded');
            }

            // Send welcome email to customer with WELCOME15 code
            // TEMPORARILY DISABLED - will re-enable once template is fully configured
            /* await emailjs.send('service_g6v2rb9', 'templatenewsletterwelcom', {
                to_email: email,
                email: email
            }); */

            // Admin notification - DISABLED (template_newsletter doesn't exist yet)
            // You can manually check localStorage for subscribers

            // Save to localStorage for manual follow-up
            const subscribers = JSON.parse(localStorage.getItem('kleinkraak-newsletter-subscribers') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('kleinkraak-newsletter-subscribers', JSON.stringify(subscribers));
            }

            // Success
            submitBtn.textContent = '✓ Subscribed!';
            submitBtn.style.background = '#2E7D32';
            emailInput.value = '';

            // Show thank you message
            const thankYouMsg = document.createElement('p');
            thankYouMsg.style.color = 'white';
            thankYouMsg.style.marginTop = '10px';
            thankYouMsg.textContent = 'Thanks for subscribing! We\'ll send you updates and exclusive offers.';
            newsletterForm.appendChild(thankYouMsg);

            // Reset after 5 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                thankYouMsg.remove();
            }, 5000);

        } catch (error) {
            console.error('Newsletter signup error:', error);
            submitBtn.textContent = 'Try Again';
            submitBtn.disabled = false;

            // Show error message
            alert('Oops! Something went wrong. Please try again or contact us directly at kleinkraak@gmail.com');
        }
    });
});
