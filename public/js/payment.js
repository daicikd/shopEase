// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const buyNowItem = urlParams.get('productId');

// Initialize payment state
let selectedPaymentMethod = 'card';

// Format card number with spaces
function formatCardNumber(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    input.value = formattedValue;
}

// Format expiry date
function formatExpiryDate(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    input.value = value;
}

// Only allow numbers in CVV
document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});

// Display order summary
function displayOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    orderItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        // Construct the image URL
        const imageUrl = item.image_url || (item.image ? `/images/products/${item.image}` : '/images/placeholder.jpg');
        
        orderItems.innerHTML += `
            <div class="order-item">
                <div class="item-details">
                    <img src="${imageUrl}" alt="${item.name}" class="item-image" onerror="this.src='/images/placeholder.jpg'">
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                    <div class="item-price">$${itemTotal.toFixed(2)}</div>
                </div>
            </div>
        `;
    });
    
    orderTotal.textContent = `$${total.toFixed(2)}`;
}

// Select payment method
function selectPayment(method) {
    selectedPaymentMethod = method;
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = document.querySelector(`.payment-option[onclick*="${method}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    // Show/hide card form based on selection
    const cardForm = document.getElementById('card-form');
    cardForm.style.display = method === 'card' ? 'block' : 'none';
}

// Generate a unique order ID
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `ORD-${timestamp}-${random}`;
}

// Show notification message
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '1000';
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Validate card number using Luhn algorithm
function validateCardNumber(number) {
    let sum = 0;
    let isEven = false;
    
    // Remove all non digit characters
    number = number.replace(/\D/g, '');
    
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number[i], 10);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

// Show loading overlay
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Process payment
async function processPayment(event) {
    event.preventDefault();
    showLoading();

    try {
        // Get cart items
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            throw new Error('Cart is empty');
        }

        // Get authentication token
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Please login to complete your purchase');
        }

        // Calculate total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Prepare request data
        const requestData = {
            items: cart.map(item => ({
                product_id: item.productId,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            total: total
        };

        console.log('Sending purchase request:', requestData); // Debug log

        // Create purchase record
        const response = await fetch('/api/purchases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestData)
        });

        console.log('Response status:', response.status); // Debug log

        const data = await response.json();
        console.log('Response data:', data); // Debug log

        if (!response.ok) {
            throw new Error(data.error || 'Failed to process payment');
        }

        // Clear the cart
        localStorage.removeItem('cart');
        localStorage.removeItem('cartCount');
        
        // Show success message
        showNotification('Order placed successfully!', 'success');
        
        // Redirect to profile page after 2 seconds
        setTimeout(() => {
            window.location.href = '/profile.html';
        }, 2000);
    } catch (error) {
        console.error('Payment processing failed:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        hideLoading();
        showNotification(error.message || 'Payment failed. Please try again.', 'error');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Display order summary
    displayOrderSummary();
    
    // Add input formatting
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    
    cardNumber.addEventListener('input', () => formatCardNumber(cardNumber));
    expiryDate.addEventListener('input', () => formatExpiryDate(expiryDate));
    cvv.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
    
    // Handle form submission
    document.getElementById('paymentForm').addEventListener('submit', processPayment);
    
    // Add CVV tooltip
    const cvvHelp = document.querySelector('.cvv-help');
    cvvHelp.innerHTML = '<i class="bi bi-question-circle"></i>';
    cvvHelp.title = 'The CVV is the 3 or 4 digit security code on the back of your card';
}); 