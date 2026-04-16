export class Cart {
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
