async function loadOrders() {
    try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        const container = document.getElementById('orders-content');

        if (!data.success || data.orders.length === 0) {
            container.innerHTML = `
                <div class="empty-orders">
                    <p>No orders yet</p>
                    <a href="/products" class="btn btn-primary">Start Shopping</a>
                </div>
            `;
            return;
        }

        container.innerHTML = data.orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id">Order #${order.id}</span>
                    <span class="order-status status-${order.status}">${order.status.toUpperCase()}</span>
                </div>
                <div class="order-details">
                    <p><strong>Customer:</strong> ${order.customerName}</p>
                    <p><strong>Email:</strong> ${order.email}</p>
                    <p><strong>Address:</strong> ${order.address}</p>
                    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div class="order-items">
                    <h4>Items:</h4>
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name}</span>
                            <span>${item.quantity} x $${item.price.toFixed(2)}</span>
                            <span>$${item.subtotal.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <strong>Total: $${order.total.toFixed(2)}</strong>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

async function updateCartCount() {
    try {
        const response = await fetch('/api/cart');
        const data = await response.json();
        document.getElementById('cart-count').textContent = data.itemCount || 0;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

loadOrders();
updateCartCount();
