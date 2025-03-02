// Loaie Shalloufi
// Tareq Abu Yunis

const express = require('express');
const dbSingleton = require('../dbSingleton');
const router = express.Router();
const db = dbSingleton.getConnection();

/* ------------------------------------- Send contact form ---------------------------------------------- */
// POST /api/contact
// sends a new contact form to the database
router.post('/', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
        return res.status(500).json({"error": 'Invalid values, failed to send message.'});

    const query = 'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)';
    db.query(query, [name, email, message], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to send message!' });
        }
        return res.json({"message": "Successfully sent message." });
    })
})



module.exports = router;
