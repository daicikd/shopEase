const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data/database.sqlite');

// Initialize database if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Registration route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    // Input validation
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    
    try {
        // Check if user already exists
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (user) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            
            try {
                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);
                
                // Insert new user
                db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                    [name, email, hashedPassword],
                    function(err) {
                        if (err) {
                            console.error('Error creating user:', err);
                            return res.status(500).json({ error: 'Error creating user' });
                        }
                        
                        // Create session
                        req.session.userId = this.lastID;
                        req.session.userName = name;
                        
                        res.json({ 
                            success: true, 
                            message: 'Registration successful',
                            user: {
                                id: this.lastID,
                                name: name,
                                email: email
                            }
                        });
                    });
            } catch (hashError) {
                console.error('Password hashing error:', hashError);
                return res.status(500).json({ error: 'Error processing password' });
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        try {
            const match = await bcrypt.compare(password, user.password);
            
            if (!match) {
                return res.status(400).json({ error: 'Invalid password' });
            }
            
            // Create session
            req.session.userId = user.id;
            req.session.userName = user.name;
            
            res.json({ 
                success: true, 
                message: 'Login successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

// Check authentication status
router.get('/status', (req, res) => {
    if (req.session.userId) {
        // Get fresh user data from database
        db.get('SELECT id, name, email FROM users WHERE id = ?', 
            [req.session.userId], 
            (err, user) => {
                if (err) {
                    console.error('Status check error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                
                if (!user) {
                    // User not found in database, clear session
                    req.session.destroy();
                    return res.json({ authenticated: false });
                }
                
                res.json({
                    authenticated: true,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });
            });
    } else {
        res.json({ authenticated: false });
    }
});

module.exports = router; 