// Loaie Shalloufi
// Tareq Abu Yunis

const dbSingleton = require('../dbSingleton');
const db = dbSingleton.getConnection();

/* -------------------- MIDDLEWARES -------------------- */
// Middleware to check if a user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.status(401).json({ error: "Unauthorized: Please log in." });
    }
}
  
// Middleware to check if the current user can modify the article
function canModifyArticle(req, res, next) {
    const { username, role } = req.session.user;
    const articleId = req.params.id;

    const query = 'SELECT author FROM articles WHERE id = ?';
    db.query(query, [articleId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error.' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Article not found.' });
        }
        // Allow if the current user is the article's author or an admin
        const articleAuthor = result[0].author;
        if (articleAuthor !== username && role !== 'admin') {
            return res.status(403).json({ error: "Forbidden: You are not authorized to modify this article." });
        }
        next(); // Only move on if permitted
    });
}

module.exports = { 
    isAuthenticated, 
    canModifyArticle 
};
