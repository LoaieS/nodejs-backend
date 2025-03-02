// Loaie Shalloufi
// Tareq Abu Yunis

const express = require('express');
const dbSingleton = require('../dbSingleton');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = dbSingleton.getConnection();


/* ------------------------------------- REGISTER ---------------------------------------------- */
// POST /api/users/register
// Creates a new user, hashes the password, and stores session info
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        return res.status(500).json({ error: 'Missing required fields: username, email, or password.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        // Use provided role or default to 'user'
        const userRole = role || 'user';
        
        db.query(query, [username, email, hashedPassword, userRole], (err, result) => {
            if (err) {
                // Handle duplicate username / email error
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Username / Email already exists.' });
                }
                return res.status(500).json({ error: 'Database error during registration.' });
            }
            
            // Save user info in session
            req.session.user = { username, role: userRole };
            return res.status(201).json({ message: 'User registered successfully.', user: req.session.user });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Error occured during registration.' });
    }
});

/* ------------------------------------- LOGIN ---------------------------------------------- */
// POST /api/users/login
// Logs in an existing user by verifying the password and saving session info
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Missing required fields: username or password.' });
    }

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error during login.' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        const user = result[0];
        try {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ error: 'Invalid username / password.' });
            }
            // Save username and role in session
            req.session.user = {"username": user.username, "role": user.role};
            return res.status(200).json({ message: 'Logged in successfully.', user: req.session.user });
        } catch (error) {
            return res.status(500).json({ error: 'Error during login.' });
        }
    });
});

/* ------------------------------------- LOGOUT ---------------------------------------------- */
// POST /api/users/logout
// Logs out the user by destroying the session
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out.' });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out successfully.' });
    });
});


/* ------------------------------------- CURRENT ---------------------------------------------- */
// GET /api/users/current
// Gets the current user from the session
router.get('/current', (req, res) => {
    if (req.session && req.session.user) {
        return res.json(req.session.user);
    }
    else {
        return res.status(500).json({error: `No user is currently logged in.`});
    }
});

module.exports = router;
