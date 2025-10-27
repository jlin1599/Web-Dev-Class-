// Header interactions
const nav = document.getElementById('site-nav');
const hamburger = document.getElementById('hamburger');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
}

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Simple slider
const slider = document.getElementById('gallery-slider');
if (slider) {
  const track = slider.querySelector('.slides');
  const images = Array.from(track.querySelectorAll('img'));
  const prevBtn = slider.querySelector('.prev');
  const nextBtn = slider.querySelector('.next');
  let index = 0;

  function update() {
    track.style.transform = `translateX(${-index * 100}%)`;
  }

  function go(delta) {
    index = (index + delta + images.length) % images.length;
    update();
  }

  prevBtn?.addEventListener('click', () => go(-1));
  nextBtn?.addEventListener('click', () => go(1));

  let auto = setInterval(() => go(1), 4000);
  slider.addEventListener('mouseenter', () => clearInterval(auto));
  slider.addEventListener('mouseleave', () => (auto = setInterval(() => go(1), 4000)));
}

// Contact form validation (client-side only)
const form = document.getElementById('contact-form');
if (form) {
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const messageEl = document.getElementById('message');
  const successEl = document.getElementById('form-success');

  function setError(id, msg) {
    const el = document.querySelector(`.error[data-for="${id}"]`);
    if (el) el.textContent = msg || '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    setError('name', '');
    setError('email', '');
    setError('message', '');

    if (!nameEl.value.trim()) {
      setError('name', 'Please enter your name.');
      valid = false;
    }
    const email = emailEl.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('email', 'Please enter a valid email.');
      valid = false;
    }
    if (!messageEl.value.trim()) {
      setError('message', 'Please enter a message.');
      valid = false;
    }

    if (valid) {
      successEl.textContent = 'Thanks! Your message has been sent.';
      form.reset();
    }
  });
}

// Shopping Cart Functionality
class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateCartDisplay();
  }

  bindEvents() {
    // Cart toggle events
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');

    if (cartToggle) {
      cartToggle.addEventListener('click', () => this.openCart());
    }

    if (cartClose) {
      cartClose.addEventListener('click', () => this.closeCart());
    }

    if (cartOverlay) {
      cartOverlay.addEventListener('click', () => this.closeCart());
    }

    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = e.target.dataset.name;
        const price = parseFloat(e.target.dataset.price);
        const description = e.target.dataset.description;
        this.addItem(name, price, description);
      });
    });

    // Clear cart button
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => this.clearCart());
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.checkout());
    }
  }

  addItem(name, price, description) {
    const existingItem = this.items.find(item => item.name === name);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        name,
        price,
        description,
        quantity: 1
      });
    }
    
    this.saveCart();
    this.updateCartDisplay();
    this.showAddToCartAnimation();
  }

  removeItem(name) {
    this.items = this.items.filter(item => item.name !== name);
    this.saveCart();
    this.updateCartDisplay();
  }

  updateQuantity(name, newQuantity) {
    const item = this.items.find(item => item.name === name);
    if (item) {
      if (newQuantity <= 0) {
        this.removeItem(name);
      } else {
        item.quantity = newQuantity;
        this.saveCart();
        this.updateCartDisplay();
      }
    }
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartDisplay();
  }

  getTotalPrice() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    // Update cart count
    if (cartCount) {
      cartCount.textContent = this.getTotalItems();
    }

    // Update cart total
    if (cartTotal) {
      cartTotal.textContent = this.getTotalPrice().toFixed(2);
    }

    // Update cart items
    if (cartItems) {
      if (this.items.length === 0) {
        cartItems.innerHTML = `
          <div class="empty-cart">
            <div class="empty-cart-icon">🛒</div>
            <p>Your cart is empty</p>
            <p>Add some delicious items from our menu!</p>
          </div>
        `;
      } else {
        cartItems.innerHTML = this.items.map(item => `
          <div class="cart-item">
            <div class="cart-item-info">
              <h4 class="cart-item-name">${item.name}</h4>
              <p class="cart-item-description">${item.description}</p>
              <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            </div>
            <div class="cart-item-controls">
              <button class="quantity-btn" onclick="cart.updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="quantity-btn" onclick="cart.updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
              <button class="remove-item" onclick="cart.removeItem('${item.name}')">Remove</button>
            </div>
          </div>
        `).join('');
      }
    }
  }

  openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar) cartSidebar.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  showAddToCartAnimation() {
    const cartToggle = document.getElementById('cart-toggle');
    if (cartToggle) {
      cartToggle.style.transform = 'scale(1.1)';
      setTimeout(() => {
        cartToggle.style.transform = 'scale(1)';
      }, 200);
    }
  }

  checkout() {
    if (this.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    const total = this.getTotalPrice();
    const itemCount = this.getTotalItems();
    
    alert(`Thank you for your order!\n\nItems: ${itemCount}\nTotal: $${total.toFixed(2)}\n\nYour order will be ready shortly!`);
    
    this.clearCart();
    this.closeCart();
  }

  saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(this.items));
  }

  loadCart() {
    const saved = localStorage.getItem('shoppingCart');
    return saved ? JSON.parse(saved) : [];
  }
}

// Initialize shopping cart
let cart;
document.addEventListener('DOMContentLoaded', () => {
  cart = new ShoppingCart();
});


