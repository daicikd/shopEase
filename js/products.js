// Product data
const products = [
    {
        id: 1,
        name: "Smartphone X",
        price: 699.99,
        image: "smartphone.jpg",
        category: "Electronics",
        description: "Latest smartphone with advanced features and high-resolution camera."
    },
    {
        id: 2,
        name: "Laptop Pro",
        price: 1299.99,
        image: "laptop.jpg",
        category: "Electronics",
        description: "Powerful laptop for professionals with long battery life."
    },
    {
        id: 3,
        name: "Wireless Headphones",
        price: 199.99,
        image: "headphones.jpg",
        category: "Electronics",
        description: "Premium noise-cancelling wireless headphones."
    },
    {
        id: 4,
        name: "Smart Watch",
        price: 249.99,
        image: "smartwatch.jpg",
        category: "Electronics",
        description: "Fitness tracker and smartwatch with heart rate monitor."
    },
    {
        id: 5,
        name: "Tablet Ultra",
        price: 499.99,
        image: "tablet.jpg",
        category: "Electronics",
        description: "Versatile tablet for work and entertainment."
    },
    {
        id: 6,
        name: "Gaming Console",
        price: 399.99,
        image: "console.jpg",
        category: "Electronics",
        description: "Next-gen gaming console with 4K graphics."
    },
    {
        id: 7,
        name: "Camera DSLR",
        price: 899.99,
        image: "camera.jpg",
        category: "Electronics",
        description: "Professional digital camera with 24MP sensor."
    },
    {
        id: 8,
        name: "Smart Speaker",
        price: 99.99,
        image: "speaker.jpg",
        category: "Electronics",
        description: "Voice-controlled smart speaker with premium sound."
    },
    {
        id: 9,
        name: "Fitness Band",
        price: 79.99,
        image: "fitness-band.jpg",
        category: "Electronics",
        description: "Activity and sleep tracker with heart rate monitor."
    },
    {
        id: 10,
        name: "External SSD",
        price: 199.99,
        image: "ssd.jpg",
        category: "Electronics",
        description: "1TB portable solid state drive with USB-C."
    },
    {
        id: 11,
        name: "Mechanical Keyboard",
        price: 129.99,
        image: "keyboard.jpg",
        category: "Electronics",
        description: "RGB mechanical gaming keyboard with customizable switches."
    },
    {
        id: 12,
        name: "Gaming Mouse",
        price: 69.99,
        image: "mouse.jpg",
        category: "Electronics",
        description: "High-precision gaming mouse with adjustable DPI."
    },
    {
        id: 13,
        name: "Running Shoes",
        price: 89.99,
        image: "shoes.jpg",
        category: "Sports",
        description: "Lightweight running shoes with responsive cushioning."
    },
    {
        id: 14,
        name: "Yoga Mat",
        price: 29.99,
        image: "yoga-mat.jpg",
        category: "Sports",
        description: "Non-slip yoga mat with carrying strap."
    },
    {
        id: 15,
        name: "Dumbbells Set",
        price: 149.99,
        image: "dumbbells.jpg",
        category: "Sports",
        description: "Adjustable dumbbells set with storage rack."
    },
    {
        id: 16,
        name: "Bicycle",
        price: 299.99,
        image: "bicycle.jpg",
        category: "Sports",
        description: "Mountain bike with 21-speed Shimano gears."
    },
    {
        id: 17,
        name: "Tennis Racket",
        price: 79.99,
        image: "tennis-racket.jpg",
        category: "Sports",
        description: "Professional tennis racket with vibration dampener."
    },
    {
        id: 18,
        name: "Basketball",
        price: 24.99,
        image: "basketball.jpg",
        category: "Sports",
        description: "Indoor/outdoor basketball with premium grip."
    },
    {
        id: 19,
        name: "Coffee Maker",
        price: 79.99,
        image: "coffee-maker.jpg",
        category: "Home",
        description: "Programmable coffee maker with thermal carafe."
    },
    {
        id: 20,
        name: "Blender",
        price: 59.99,
        image: "blender.jpg",
        category: "Home",
        description: "High-speed blender for smoothies and food processing."
    },
    {
        id: 21,
        name: "Toaster",
        price: 39.99,
        image: "toaster.jpg",
        category: "Home",
        description: "2-slice toaster with bagel setting."
    },
    {
        id: 22,
        name: "Microwave",
        price: 89.99,
        image: "microwave.jpg",
        category: "Home",
        description: "Countertop microwave with sensor cooking."
    },
    {
        id: 23,
        name: "Vacuum Cleaner",
        price: 199.99,
        image: "vacuum.jpg",
        category: "Home",
        description: "Bagless vacuum cleaner with HEPA filter."
    },
    {
        id: 24,
        name: "Air Purifier",
        price: 149.99,
        image: "air-purifier.jpg",
        category: "Home",
        description: "HEPA air purifier for allergies and pet dander."
    },
    {
        id: 25,
        name: "Desk Lamp",
        price: 49.99,
        image: "desk-lamp.jpg",
        category: "Home",
        description: "LED desk lamp with adjustable brightness."
    },
    {
        id: 26,
        name: "Bed Sheets",
        price: 69.99,
        image: "bed-sheets.jpg",
        category: "Home",
        description: "100% cotton bed sheets set with 4 pieces."
    },
    {
        id: 27,
        name: "Throw Pillows",
        price: 24.99,
        image: "pillows.jpg",
        category: "Home",
        description: "Decorative throw pillows with removable covers."
    },
    {
        id: 28,
        name: "Wall Clock",
        price: 39.99,
        image: "clock.jpg",
        category: "Home",
        description: "Modern wall clock with silent movement."
    },
    {
        id: 29,
        name: "Backpack",
        price: 49.99,
        image: "backpack.jpg",
        category: "Fashion",
        description: "Water-resistant backpack with laptop compartment."
    },
    {
        id: 30,
        name: "Sunglasses",
        price: 79.99,
        image: "sunglasses.jpg",
        category: "Fashion",
        description: "Designer sunglasses with UV protection."
    },
    {
        id: 31,
        name: "Watch",
        price: 199.99,
        image: "watch.jpg",
        category: "Fashion",
        description: "Classic analog watch with leather strap."
    },
    {
        id: 32,
        name: "Wallet",
        price: 39.99,
        image: "wallet.jpg",
        category: "Fashion",
        description: "Genuine leather wallet with RFID protection."
    },
    {
        id: 33,
        name: "Sneakers",
        price: 89.99,
        image: "sneakers.jpg",
        category: "Fashion",
        description: "Casual sneakers with memory foam insole."
    },
    {
        id: 34,
        name: "T-Shirt",
        price: 24.99,
        image: "tshirt.jpg",
        category: "Fashion",
        description: "100% cotton t-shirt with modern fit."
    },
    {
        id: 35,
        name: "Jeans",
        price: 59.99,
        image: "jeans.jpg",
        category: "Fashion",
        description: "Classic blue jeans with stretch comfort."
    },
    {
        id: 36,
        name: "Jacket",
        price: 129.99,
        image: "jacket.jpg",
        category: "Fashion",
        description: "Water-resistant jacket with hood."
    },
    {
        id: 37,
        name: "Hat",
        price: 39.99,
        image: "hat.jpg",
        category: "Fashion",
        description: "Adjustable baseball cap with curved brim."
    },
    {
        id: 38,
        name: "Scarf",
        price: 34.99,
        image: "scarf.jpg",
        category: "Fashion",
        description: "Wool blend scarf with fringe detail."
    },
    {
        id: 39,
        name: "Belt",
        price: 39.99,
        image: "belt.jpg",
        category: "Fashion",
        description: "Genuine leather belt with classic buckle."
    },
    {
        id: 40,
        name: "Socks",
        price: 19.99,
        image: "socks.jpg",
        category: "Fashion",
        description: "Pack of 6 cotton blend socks."
    }
];

// Display products on the home page
function displayProducts(filteredProducts = products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3>No products found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="card h-100">
                <img src="/images/products/${product.image}" class="card-img-top" alt="${product.name}" 
                    onerror="this.src='/images/placeholder.jpg'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted small">${product.category}</p>
                    <p class="card-text">${product.description}</p>
                    <div class="mt-auto">
                        <p class="card-text fw-bold">$${product.price.toFixed(2)}</p>
                        <div id="product-controls-${product.id}" class="mt-2">
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary" onclick="handleAddToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                                    Add to Cart
                                </button>
                                <button class="btn btn-success" onclick="handleBuyNow(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Search products
function searchProducts(query) {
    if (!query) {
        displayProducts();
        return;
    }

    const searchTerm = query.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    displayProducts(filteredProducts);
}

// Filter products by category
function filterByCategory(category) {
    if (!category || category === 'all') {
        displayProducts();
        return;
    }

    const filteredProducts = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
    );

    displayProducts(filteredProducts);
}

// Initialize products display when page loads
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    
    // Set up search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', () => {
            searchProducts(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchProducts(searchInput.value);
            }
        });
    }
}); 

function handleAddToCart(product) {
    addToCart(product, 1); // your existing function to add to cart
    showQuantityCounter(product.id, 1);
}

function showQuantityCounter(productId, quantity) {
    const container = document.getElementById(`product-controls-${productId}`);
    if (!container) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    container.innerHTML = `
        <div class="d-grid gap-2">
            <div class="input-group">
                <button class="btn btn-outline-secondary" type="button" onclick="decreaseFromHome(${productId})">-</button>
                <input type="text" class="form-control text-center" value="${quantity}" id="counter-${productId}" readonly style="max-width: 60px;">
                <button class="btn btn-outline-secondary" type="button" onclick="increaseFromHome(${productId})">+</button>
            </div>
            <button class="btn btn-success" onclick="handleBuyNow(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                Buy Now
            </button>
        </div>
    `;
}

function increaseFromHome(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    increaseQuantity(productId); // you already have this function in cart.js
    const input = document.getElementById(`counter-${productId}`);
    if (input) {
        input.value = parseInt(input.value) + 1;
    }
}

function decreaseFromHome(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    if (item.quantity > 1) {
        decreaseQuantity(productId);
        const input = document.getElementById(`counter-${productId}`);
        if (input) {
            input.value = parseInt(input.value) - 1;
        }
    } else {
        removeFromCart(productId);
        restoreAddToCartButton(productId);
    }
}

function restoreAddToCartButton(productId) {
    const container = document.getElementById(`product-controls-${productId}`);
    if (!container) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    container.innerHTML = `
        <div class="d-grid gap-2">
            <button class="btn btn-primary" onclick="handleAddToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                Add to Cart
            </button>
            <button class="btn btn-success" onclick="handleBuyNow(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                Buy Now
            </button>
        </div>
    `;
}

// Handle Buy Now click
function handleBuyNow(product) {
    addToCart(product, 1);
    window.location.href = '/cart.html';
}


