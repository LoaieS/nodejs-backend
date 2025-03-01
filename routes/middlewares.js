// Loaie Shalloufi
// Tareq Abu Yunis

const dbSingleton = require('../dbSingleton');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = dbSingleton.getConnection();

/* -------------------- USERS MIDDLEWARES -------------------- */
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

/* -------------------- FILE UPLOADS MIDDLEWARES -------------------- */
// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '..', 'data', 'article_images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// File storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Folder to save files
    },
    filename: function (req, file, cb) { // Unique file name (based on UNIX timestamp + file extension)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// File filter to allow only images
const imageFilter = function(req, file, cb) {
    // Use a regex to check for valid image extensions
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'), false);
    }
    cb(null, true);
};

// Initialize the Multer upload middleware with our storage configuration & image filters
const upload = multer({ storage: storage, fileFilter: imageFilter });

module.exports = { 
    isAuthenticated, 
    canModifyArticle,
    upload
};
