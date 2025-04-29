// User management
let currentUser = null;

// Check if user is authenticated
async function checkAuth() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            updateNavigation(false);
            return false;
        }

        const response = await fetch('/api/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            updateNavigation(true);
            return true;
        } else {
            // If token is invalid, clear it
            localStorage.removeItem('token');
            updateNavigation(false);
            return false;
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        updateNavigation(false);
        return false;
    }
}

// Handle Registration
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate input
    if (!name || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and user data
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            
            showSuccess('Registration successful! Redirecting...');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            showError(data.error || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        showError('Registration failed. Please try again.');
    }
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate input
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and user data
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            
            showSuccess('Login successful! Redirecting...');
            
            // Check if there's a redirect URL stored in sessionStorage
            const redirectUrl = sessionStorage.getItem('redirectUrl');
            if (redirectUrl) {
                sessionStorage.removeItem('redirectUrl');
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1000);
            } else {
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
        } else {
            showError(data.error || 'Invalid email or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        showError('Login failed. Please try again.');
    }
}

// Handle Logout
async function handleLogout() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
        
        // Clear user data
        localStorage.removeItem('token');
        currentUser = null;
        updateNavigation(false);
        
        showSuccess('Logged out successfully!');
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

// Add purchase to history
function addToPurchaseHistory(items, total) {
    if (!currentUser) return;

    const purchase = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        total: total
    };

    // Add to user's purchase history
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].purchaseHistory.push(purchase);
        currentUser.purchaseHistory.push(purchase);
        
        // Update storage
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }
}

// Show user not found message with registration link
function showUserNotFoundMessage() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.innerHTML = 'User not found. <a href="/register.html">Register here</a>';
        errorDiv.style.display = 'block';
    }
}

// Update navigation based on auth status
function updateNavigation(isAuthenticated) {
    const authButtons = document.getElementById('authButtons');
    if (authButtons) {
        if (isAuthenticated) {
            authButtons.innerHTML = `
                <a href="/profile.html" class="btn btn-outline-light me-2"><i class="bi bi-person me-1"></i>Profile</a>
                <a href="#" onclick="handleLogout()" class="btn btn-primary"><i class="bi bi-box-arrow-right me-1"></i>Logout</a>
            `;
        } else {
            authButtons.innerHTML = `
                <a href="/login.html" class="btn btn-outline-light me-2"><i class="bi bi-box-arrow-in-right me-1"></i>Login</a>
                <a href="/register.html" class="btn btn-primary"><i class="bi bi-person-plus me-1"></i>Register</a>
            `;
        }
    }
}

// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', checkAuth); 