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

// Get user profile
router.get('/profile', requireAuth, (req, res) => {
    const userId = req.session.userId;
    
    db.get('SELECT id, name, email, created_at FROM users WHERE id = ?', 
        [userId], 
        (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            res.json(user);
        });
});

// Get user's purchase history
router.get('/purchases', requireAuth, (req, res) => {
    const userId = req.session.userId;
    
    db.all(`
        SELECT 
            ph.id,
            ph.purchase_date,
            ph.quantity,
            ph.total_price,
            p.name as product_name,
            p.image_url
        FROM purchase_history ph
        JOIN products p ON ph.product_id = p.id
        WHERE ph.user_id = ?
        ORDER BY ph.purchase_date DESC
    `, [userId], (err, purchases) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        res.json(purchases);
    });
});

// Update user profile
router.put('/profile', requireAuth, (req, res) => {
    const userId = req.session.userId;
    const { name, email } = req.body;
    
    db.run('UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            // Update session
            req.session.userName = name;
            
            res.json({ success: true, message: 'Profile updated successfully' });
        });
});

module.exports = router; 