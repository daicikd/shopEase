// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in the UI
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Add item to cart
function addToCart(product, quantity = 1) {
    try {
        const productId = product.id;
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ 
                productId, 
                quantity,
                name: product.name,
                price: product.price,
                image: product.image
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
        showNotification('Item added to cart successfully!', 'success');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('An error occurred while adding to cart', 'error');
    }
}

// Decrease quantity
function decreaseQuantity(productId) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCartItems();
            showNotification('Cart updated successfully!', 'success');
        } else {
            removeFromCart(productId);
        }
    }
}

// Increase quantity
function increaseQuantity(productId) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
        showNotification('Cart updated successfully!', 'success');
    }
}

// Update quantity directly
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
        showNotification('Cart updated successfully!', 'success');
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
    showNotification('Item removed from cart successfully!', 'success');
}

// Update cart total
function updateCartTotal() {
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-5">
                <h3>Your cart is empty</h3>
                <a href="/" class="btn btn-primary mt-3">Continue Shopping</a>
            </div>
        `;
        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
        return;
    }

    if (cartSummary) {
        cartSummary.style.display = 'block';
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="card mb-3" data-product-id="${item.productId}">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="/images/products/${item.image}" alt="${item.name}" class="img-fluid" 
                            onerror="this.src='/images/placeholder.jpg'">
                    </div>
                    <div class="col-md-4">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="col-md-3">
                        <div class="input-group">
                            <button class="btn btn-outline-secondary decrease-btn" type="button">-</button>
                            <input type="number" class="form-control text-center quantity-input" 
                                value="${item.quantity}" min="1" style="max-width: 80px;">
                            <button class="btn btn-outline-secondary increase-btn" type="button">+</button>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <p class="card-text fw-bold item-total">$${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div class="col-md-1">
                        <button class="btn btn-danger remove-btn" type="button">🗑️</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Attach event listeners after rendering
    const decreaseButtons = cartItemsContainer.querySelectorAll('.decrease-btn');
    const increaseButtons = cartItemsContainer.querySelectorAll('.increase-btn');
    const removeButtons = cartItemsContainer.querySelectorAll('.remove-btn');
    const quantityInputs = cartItemsContainer.querySelectorAll('.quantity-input');

    decreaseButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            decreaseQuantity(cart[index].productId);
        });
    });

    increaseButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            increaseQuantity(cart[index].productId);
        });
    });

    removeButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            removeFromCart(cart[index].productId);
        });
    });

    quantityInputs.forEach((input, index) => {
        input.addEventListener('change', (e) => {
            let newQuantity = parseInt(e.target.value);
            if (isNaN(newQuantity) || newQuantity < 1) {
                newQuantity = 1;
            }
            updateQuantity(cart[index].productId, newQuantity);
        });
    });

    updateCartTotal();
}


// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Store the current page in sessionStorage to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', '/payment.html');
        window.location.href = '/payment.html';
        return;
    }

    // Redirect to payment page
    window.location.href = '/payment.html';
}

// Clear local cart (client-side)
function clearLocalCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    displayCartItems();
}); 