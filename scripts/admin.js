/**
 * Admin Panel Integration
 * Handles hamburger menu, password authentication, and stock control system loading
 */

const AdminPanel = {
    correctPassword: '2907',
    isAdminMode: false,

    init() {
        this.setupHamburgerMenu();
        this.setupPasswordModal();
        this.setupAdminButton();
        this.setupInvoiceButton();
    },

    setupInvoiceButton() {
        const btn = document.getElementById('invoice-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                this.pendingAction = 'invoice';
                this.closeSidebar();
                this.openPasswordModal();
            });
        }
    },

    // Setup hamburger menu
    setupHamburgerMenu() {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const sidebar = document.getElementById('admin-sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const closeSidebarBtn = document.getElementById('close-sidebar-btn');

        hamburgerBtn.addEventListener('click', () => {
            this.openSidebar();
        });

        closeSidebarBtn.addEventListener('click', () => {
            this.closeSidebar();
        });

        overlay.addEventListener('click', () => {
            this.closeSidebar();
        });
    },

    setupPasswordModal() {
        const modal = document.getElementById('admin-password-modal');
        const form = document.getElementById('admin-password-form');
        const closeBtn = document.getElementById('close-password-modal');
        const cancelBtn = document.getElementById('cancel-password-btn');
        const passwordInput = document.getElementById('admin-password');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = passwordInput.value;

            if (password === this.correctPassword) {
                this.closePasswordModal();
                passwordInput.value = '';

                if (this.pendingAction === 'invoice') {
                    // Redirect to dedicated page
                    window.location.href = 'invoices.html';
                } else {
                    this.loadStockControl();
                }
                this.pendingAction = null;
            } else {
                alert('Incorrect password. Please try again.');
                passwordInput.value = '';
                passwordInput.focus();
            }
        });

        closeBtn.addEventListener('click', () => {
            this.closePasswordModal();
            passwordInput.value = '';
        });

        cancelBtn.addEventListener('click', () => {
            this.closePasswordModal();
            passwordInput.value = '';
        });

        // Close on overlay click
        document.getElementById('overlay').addEventListener('click', () => {
            if (modal.classList.contains('active')) {
                this.closePasswordModal();
                passwordInput.value = '';
            }
        });
    },

    // Setup admin button
    setupAdminButton() {
        const adminBtn = document.getElementById('admin-btn');
        adminBtn.addEventListener('click', () => {
            this.closeSidebar();
            this.openPasswordModal();
        });
    },

    // Open sidebar
    openSidebar() {
        document.getElementById('admin-sidebar').classList.add('active');
        document.getElementById('sidebar-overlay').classList.add('active');
    },

    // Close sidebar
    closeSidebar() {
        document.getElementById('admin-sidebar').classList.remove('active');
        document.getElementById('sidebar-overlay').classList.remove('active');
    },

    // Open password modal
    openPasswordModal() {
        const modal = document.getElementById('admin-password-modal');
        const overlay = document.getElementById('overlay');
        modal.classList.add('active');
        overlay.classList.add('active');

        // Focus password input
        setTimeout(() => {
            document.getElementById('admin-password').focus();
        }, 100);
    },

    // Close password modal
    closePasswordModal() {
        document.getElementById('admin-password-modal').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
    },

    // Load stock control system
    loadStockControl() {
        const container = document.getElementById('stock-control-container');

        if (this.isAdminMode) {
            // Already loaded, just show it
            container.classList.add('active');
            return;
        }

        // Create iframe to load stock control system
        container.innerHTML = `
            <div style="position: relative; width: 100%; height: 100vh;">
                <style>
                    #close-stock-control {
                        position: absolute; 
                        bottom: 30px; 
                        right: 30px; 
                        z-index: 10002; 
                        background: #4A6741; 
                        color: white; 
                        border: none; 
                        padding: 0.75rem 1.5rem; 
                        border-radius: 50px; 
                        cursor: pointer; 
                        font-family: 'Outfit', sans-serif; 
                        font-weight: 600; 
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
                        transition: all 0.3s ease; 
                        display: flex; 
                        align-items: center; 
                        gap: 8px;
                    }
                    @media (max-width: 768px) {
                        #close-stock-control {
                            bottom: 20px;
                            right: 20px;
                            padding: 0.6rem 1rem;
                            font-size: 0.9rem;
                        }
                        #close-stock-control span {
                            display: none; /* Hide text on very small screens if needed, or keep it */
                        }
                    }
                </style>
                <button id="close-stock-control">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span>Back to Website</span>
                </button>
                <iframe src="stock-control/index.html" style="width: 100%; height: 100vh; border: none; display: block;"></iframe>
            </div>
        `;

        // Setup close button
        setTimeout(() => {
            const closeBtn = document.getElementById('close-stock-control');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeStockControl();
                });
            }
        }, 100);

        this.isAdminMode = true;
        container.classList.add('active');
    },

    closeStockControl() {
        document.getElementById('stock-control-container').classList.remove('active');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    AdminPanel.init();
});
