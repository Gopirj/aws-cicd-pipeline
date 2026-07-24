async function loadOrderSummary() {
    try {
        const response = await fetch('/api/cart');
        const data = await response.json();
        const container = document.getElementById('order-items');
        document.getElementById('cart-count').textContent = data.itemCount || 0;

        if (!data.success || data.cart.length === 0) {
            container.innerHTML = `
                <p>Your cart is empty</p>
                <a href="/products" class="btn btn-secondary">Continue Shopping</a>
            `;
            return;
        }

        container.innerHTML = `
            <div class="order-items-list">
                ${data.cart.map(item => `
                    <div class="order-item">
                        <span>${item.product.image} ${item.product.name}</span>
                        <span>${item.quantity} x $${item.product.price.toFixed(2)}</span>
                        <span>$${item.subtotal.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <strong>Total: $${data.total}</strong>
            </div>
        `;
    } catch (error) {
        console.error('Error loading order summary:', error);
    }
}

async function handleCheckout(event) {
    event.preventDefault();

    const formData = {
        customerName: document.getElementById('customerName').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const data = await response.json();

        if (data.success) {
            alert(`Order placed successfully!\nOrder ID: ${data.order.id}\nTotal: $${data.order.total}`);
            window.location.href = '/orders';
        } else {
            alert(data.message || 'Error placing order');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order. Please try again.');
    }
}

document.getElementById('checkout-form').addEventListener('submit', handleCheckout);

loadOrderSummary();
