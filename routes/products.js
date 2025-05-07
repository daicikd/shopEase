const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

// Get all products (with pagination)
router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 12; // Number of products per page
    const offset = (page - 1) * limit;

    db.all('SELECT * FROM products LIMIT ? OFFSET ?', [limit, offset], (err, products) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(products);
    });
});

// Search products
router.get('/search', (req, res) => {
    const searchTerm = `%${req.query.q}%`;
    
    db.all('SELECT * FROM products WHERE name LIKE ? OR description LIKE ?', 
        [searchTerm, searchTerm], 
        (err, products) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(products);
        });
});

// Get single product by ID
router.get('/:id', (req, res) => {
    const productId = req.params.id;
    
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product);
    });
});

// Seed initial products (admin only - for development)
router.post('/seed', (req, res) => {
    const products = [
        {
            name: 'Smartphone X',
            description: 'Latest smartphone with advanced features',
            price: 699.99,
            image_url: '/images/smartphone.jpg'
        },
        {
            name: 'Laptop Pro',
            description: 'Powerful laptop for professionals',
            price: 1299.99,
            image_url: '/images/laptop.jpg'
        },
        {
            name: 'Wireless Headphones',
            description: 'Premium noise-cancelling headphones',
            price: 199.99,
            image_url: '/images/headphones.jpg'
        },
        {
            name: 'Smart Watch',
            description: 'Fitness tracker and smartwatch',
            price: 249.99,
            image_url: '/images/smartwatch.jpg'
        },
        {
            name: 'Tablet Ultra',
            description: 'Versatile tablet for work and entertainment',
            price: 499.99,
            image_url: '/images/tablet.jpg'
        },
        {
            name: 'Gaming Console',
            description: 'Next-gen gaming console',
            price: 399.99,
            image_url: '/images/console.jpg'
        },
        {
            name: 'Camera DSLR',
            description: 'Professional digital camera',
            price: 899.99,
            image_url: '/images/camera.jpg'
        },
        {
            name: 'Smart Speaker',
            description: 'Voice-controlled smart speaker',
            price: 99.99,
            image_url: '/images/speaker.jpg'
        },
        {
            name: 'Fitness Band',
            description: 'Activity and sleep tracker',
            price: 79.99,
            image_url: '/images/fitness-band.jpg'
        },
        {
            name: 'External SSD',
            description: '1TB portable solid state drive',
            price: 199.99,
            image_url: '/images/ssd.jpg'
        },
        {
            name: 'Mechanical Keyboard',
            description: 'RGB mechanical gaming keyboard',
            price: 129.99,
            image_url: '/images/keyboard.jpg'
        },
        {
            name: 'Gaming Mouse',
            description: 'High-precision gaming mouse',
            price: 69.99,
            image_url: '/images/mouse.jpg'
        }
    ];

    const stmt = db.prepare('INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)');
    
    products.forEach(product => {
        stmt.run(product.name, product.description, product.price, product.image_url);
    });
    
    stmt.finalize();
    
    res.json({ message: 'Products seeded successfully' });
});

module.exports = router; 