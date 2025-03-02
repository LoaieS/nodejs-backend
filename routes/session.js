// Loaie Shalloufi
// Tareq Abu Yunis

const express = require('express');
const router = express.Router();


/* ------------------------------------- Sessions information ---------------------------------------------- */
// GET /api/session
// Returns user session information
router.get('/', (req, res) => {
    if (req.session && req.session.user) {
        return res.json({username: req.session.user.username, role: req.session.user.role});
    }
    else {
        return res.status(500).json({error: `User session does not exist.`});
    }
});

module.exports = router;