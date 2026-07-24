const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'website')));

// Sample product data
const products = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, image: '🎧', category: 'Electronics', stock: 50 },
  { id: 2, name: 'Smart Watch', price: 199.99, image: '⌚', category: 'Electronics', stock: 30 },
  { id: 3, name: 'Running Shoes', price: 89.99, image: '👟', category: 'Sports', stock: 100 },
  { id: 4, name: 'Coffee Maker', price: 49.99, image: '☕', category: 'Home', stock: 25 },
  { id: 5, name: 'Backpack', price: 39.99, image: '🎒', category: 'Travel', stock: 75 },
  { id: 6, name: 'Sunglasses', price: 59.99, image: '🕶️', category: 'Fashion', stock: 60 },
  { id: 7, name: 'Bluetooth Speaker', price: 69.99, image: '🔊', category: 'Electronics', stock: 40 },
  { id: 8, name: 'Yoga Mat', price: 29.99, image: '🧘', category: 'Sports', stock: 80 }
];

// In-memory cart (in production, use database/session)
let cart = [];
let orders = [];
let orderIdCounter = 1;

// ============ PRODUCT ENDPOINTS ============

// Get all products
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let filtered = products;

  if (category) {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  res.json({
    success: true,
    count: filtered.length,
    products: filtered
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

// ============ CART ENDPOINTS ============

// Get cart
app.get('/api/cart', (req, res) => {
  const cartWithDetails = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product: product || null,
      subtotal: product ? product.price * item.quantity : 0
    };
  });

  const total = cartWithDetails.reduce((sum, item) => sum + item.subtotal, 0);

  res.json({
    success: true,
    cart: cartWithDetails,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    total: total.toFixed(2)
  });
});

// Add to cart
app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ success: false, message: 'Insufficient stock' });
  }

  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  res.json({ success: true, message: 'Item added to cart', cart });
});

// Update cart item quantity
app.put('/api/cart/:productId', (req, res) => {
  const { quantity } = req.body;
  const productId = parseInt(req.params.productId);

  if (quantity <= 0) {
    cart = cart.filter(item => item.productId !== productId);
  } else {
    const item = cart.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  res.json({ success: true, message: 'Cart updated', cart });
});

// Remove from cart
app.delete('/api/cart/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  cart = cart.filter(item => item.productId !== productId);
  res.json({ success: true, message: 'Item removed from cart', cart });
});

// Clear cart
app.delete('/api/cart', (req, res) => {
  cart = [];
  res.json({ success: true, message: 'Cart cleared', cart });
});

// ============ ORDER ENDPOINTS ============

// Create order (checkout)
app.post('/api/orders', (req, res) => {
  const { customerName, email, address } = req.body;

  if (!customerName || !email || !address) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  if (cart.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty' });
  }

  const orderItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      productId: item.productId,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal: product.price * item.quantity
    };
  });

  const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  const order = {
    id: orderIdCounter++,
    customerName,
    email,
    address,
    items: orderItems,
    total: parseFloat(total.toFixed(2)),
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  cart = []; // Clear cart after order

  res.json({
    success: true,
    message: 'Order placed successfully',
    order
  });
});

// Get all orders
app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    count: orders.length,
    orders
  });
});

// Get single order
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

// ============ HEALTH & INFO ENDPOINTS ============

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: require('../package.json').version
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    app: 'E-Commerce Store',
    description: 'Simple e-commerce website with CI/CD pipeline',
    features: ['Product listing', 'Shopping cart', 'Checkout', 'Order management'],
    pipeline: 'AWS CodePipeline',
    build: 'AWS CodeBuild',
    deploy: 'AWS CodeDeploy',
    monitoring: 'Amazon CloudWatch'
  });
});

app.get('/api/metrics', (req, res) => {
  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    cartItems: cart.reduce((sum, item) => sum + item.quantity, 0),
    successRate: (95 + Math.random() * 5).toFixed(2),
    lastDeployment: new Date().toISOString()
  });
});

// ============ FRONTEND ROUTES ============

const websitePath = path.join(__dirname, '..', 'website');

app.get('/', (req, res) => {
  res.sendFile(path.join(websitePath, 'index.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(websitePath, 'products.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(websitePath, 'cart.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(websitePath, 'checkout.html'));
});

app.get('/orders', (req, res) => {
  res.sendFile(path.join(websitePath, 'orders.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`E-Commerce Server running on port ${PORT}`);
  });
}

module.exports = app;
