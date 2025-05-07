// FINAL app.js (Merged and Fixed)

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');

const authRouter = require('./routes/auth');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const usersRouter = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'shopease-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Database setup
const db = new sqlite3.Database('./data/database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Create database tables if they don't exist
const createTables = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS purchase_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        purchase_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (purchase_id) REFERENCES purchases(id)
    );
`;

// Initialize database
function initializeDatabase() {
    db.exec(createTables, (err) => {
        if (err) {
            console.error('Error creating tables:', err);
        } else {
            console.log('Database tables created successfully');
        }
    });
}

// JWT secret
const JWT_SECRET = 'your-secret-key';

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Routes
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/users', usersRouter);

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    try {
        // Check if user already exists
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                console.error('Error checking user:', err);
                return res.status(500).json({ error: 'Registration failed' });
            }
            
            if (user) {
                return res.status(400).json({ error: 'Email already registered' });
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Insert new user
            db.run(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword],
                function(err) {
                    if (err) {
                        console.error('Error creating user:', err);
                        return res.status(500).json({ error: 'Registration failed' });
                    }
                    
                    // Generate JWT token for immediate login
                    const token = jwt.sign(
                        { id: this.lastID, email: email },
                        JWT_SECRET,
                        { expiresIn: '24h' }
                    );
                    
                    res.status(201).json({
                        message: 'Registration successful',
                        token,
                        user: {
                            id: this.lastID,
                            name,
                            email
                        }
                    });
                }
            );
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            console.error('Error finding user:', err);
            return res.status(500).json({ error: 'Login failed' });
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        try {
            const passwordMatch = await bcrypt.compare(password, user.password);
            
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            
            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    // Since we're using JWT, the client is responsible for removing the token
    res.json({ message: 'Logged out successfully' });
});

// Get user profile and purchase history
app.get('/api/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;

    // Get user information
    db.get('SELECT id, name, email, created_at FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Failed to fetch user profile' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get user's purchase history
        db.all(`
            SELECT p.id, p.total, p.purchase_date as date,
                   GROUP_CONCAT(json_object(
                       'id', pi.id,
                       'product_id', pi.product_id,
                       'name', pi.name,
                       'price', pi.price,
                       'quantity', pi.quantity
                   )) as items
            FROM purchases p
            LEFT JOIN purchase_items pi ON p.id = pi.purchase_id
            WHERE p.user_id = ?
            GROUP BY p.id
            ORDER BY p.purchase_date DESC
        `, [userId], (err, purchases) => {
            if (err) {
                console.error('Error fetching purchases:', err);
                return res.status(500).json({ error: 'Failed to fetch purchase history' });
            }

            // Parse the items JSON string for each purchase
            const formattedPurchases = purchases.map(purchase => ({
                ...purchase,
                items: JSON.parse(`[${purchase.items}]`)
            }));

            res.json({
                user: {
                    ...user,
                    purchases: formattedPurchases
                }
            });
        });
    });
});

// Create a new purchase
app.post('/api/purchases', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { items, total } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0 || !total) {
        return res.status(400).json({ error: 'Invalid purchase data' });
    }

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Insert purchase record
        db.run(
            'INSERT INTO purchases (user_id, total) VALUES (?, ?)',
            [userId, total],
            function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    console.error('Error creating purchase:', err);
                    return res.status(500).json({ error: 'Failed to create purchase' });
                }

                const purchaseId = this.lastID;

                // Insert purchase items
                const stmt = db.prepare(`
                    INSERT INTO purchase_items (purchase_id, product_id, name, price, quantity)
                    VALUES (?, ?, ?, ?, ?)
                `);

                items.forEach(item => {
                    stmt.run(
                        purchaseId,
                        item.product_id,
                        item.name,
                        item.price,
                        item.quantity
                    );
                });

                stmt.finalize();

                db.run('COMMIT', (err) => {
                    if (err) {
                        db.run('ROLLBACK');
                        console.error('Error committing purchase:', err);
                        return res.status(500).json({ error: 'Failed to create purchase' });
                    }

                    res.json({
                        message: 'Purchase created successfully',
                        purchaseId: purchaseId
                    });
                });
            }
        );
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
