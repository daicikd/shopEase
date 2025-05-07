const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
};

// Get cart items
router.get('/', requireAuth, (req, res) => {
    const userId = req.session.userId;
    
    db.all(`
        SELECT 
            c.id as cart_id,
            c.quantity,
            p.id as product_id,
            p.name,
            p.price,
            p.image_url,
            (p.price * c.quantity) as total_price
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    `, [userId], (err, items) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        const total = items.reduce((sum, item) => sum + item.total_price, 0);
        
        res.json({
            items,
            total
        });
    });
});

// Add item to cart
router.post('/add', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const { productId, quantity } = req.body;
    
    // Check if product exists
    db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Check if item already in cart
        db.get('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', 
            [userId, productId], 
            (err, cartItem) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                
                if (cartItem) {
                    // Update quantity
                    db.run('UPDATE cart SET quantity = quantity + ? WHERE id = ?',
                        [quantity, cartItem.id],
                        function(err) {
                            if (err) {
                                return res.status(500).json({ error: 'Database error' });
                            }
                            res.json({ success: true, message: 'Cart updated' });
                        });
                } else {
                    // Add new item
                    db.run('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                        [userId, productId, quantity],
                        function(err) {
                            if (err) {
                                return res.status(500).json({ error: 'Database error' });
                            }
                            res.json({ success: true, message: 'Item added to cart' });
                        });
                }
            });
    });
});

// Update cart item quantity
router.put('/update/:cartId', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const cartId = req.params.cartId;
    const { quantity } = req.body;
    
    db.run('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
        [quantity, cartId, userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Cart item not found' });
            }
            
            res.json({ success: true, message: 'Cart updated' });
        });
});

// Remove item from cart
router.delete('/remove/:cartId', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const cartId = req.params.cartId;
    
    db.run('DELETE FROM cart WHERE id = ? AND user_id = ?',
        [cartId, userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Cart item not found' });
            }
            
            res.json({ success: true, message: 'Item removed from cart' });
        });
});

// Checkout process
router.post('/checkout', requireAuth, (req, res) => {
    const userId = req.session.userId;
    
    // Start transaction
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        // Get cart items
        db.all('SELECT * FROM cart WHERE user_id = ?', [userId], (err, cartItems) => {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (cartItems.length === 0) {
                db.run('ROLLBACK');
                return res.status(400).json({ error: 'Cart is empty' });
            }
            
            // Process each item
            let processedItems = 0;
            
            cartItems.forEach(item => {
                // Get product price
                db.get('SELECT price FROM products WHERE id = ?', [item.product_id], (err, product) => {
                    if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: 'Database error' });
                    }
                    
                    const totalPrice = product.price * item.quantity;
                    
                    // Add to purchase history
                    db.run(`
                        INSERT INTO purchase_history (user_id, product_id, quantity, total_price)
                        VALUES (?, ?, ?, ?)
                    `, [userId, item.product_id, item.quantity, totalPrice], function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: 'Database error' });
                        }
                        
                        processedItems++;
                        
                        // If all items processed, clear cart and commit
                        if (processedItems === cartItems.length) {
                            db.run('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
                                if (err) {
                                    db.run('ROLLBACK');
                                    return res.status(500).json({ error: 'Database error' });
                                }
                                
                                db.run('COMMIT');
                                res.json({ success: true, message: 'Checkout completed successfully' });
                            });
                        }
                    });
                });
            });
        });
    });
});

module.exports = router; 