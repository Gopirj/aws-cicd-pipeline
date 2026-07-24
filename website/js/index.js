async function loadFeaturedProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        const container = document.getElementById('featured-products');
        
        if (data.success && data.products.length > 0) {
            container.innerHTML = data.products.slice(0, 4).map(product => `
                <div class="product-card">
                    <div class="product-image">${product.image}</div>
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="btn btn-small add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `).join('');

            container.querySelectorAll('.add-to-cart').forEach(btn => {
                btn.addEventListener('click', function() {
                    addToCart(parseInt(this.dataset.id));
                });
            });
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function addToCart(productId) {
    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity: 1 })
        });
        const data = await response.json();
        if (data.success) {
            updateCartCount();
            alert('Added to cart!');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
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

loadFeaturedProducts();
updateCartCount();
