let allProducts = [];

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        if (data.success) {
            allProducts = data.products;
            renderProducts(allProducts);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderProducts(products) {
    const container = document.getElementById('products-grid');
    if (products.length === 0) {
        container.innerHTML = '<p class="no-results">No products found</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.image}</div>
            <h3>${product.name}</h3>
            <p class="category">${product.category}</p>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="stock">${product.stock} in stock</p>
            <button onclick="addToCart(${product.id})" class="btn btn-primary">Add to Cart</button>
        </div>
    `).join('');
}

function filterProducts() {
    const search = document.getElementById('search').value.toLowerCase();
    const category = document.getElementById('category').value;

    let filtered = allProducts;

    if (search) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
    }
    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }

    renderProducts(filtered);
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

loadProducts();
updateCartCount();
