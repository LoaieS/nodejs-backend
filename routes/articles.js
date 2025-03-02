// Loaie Shalloufi
// Tareq Abu Yunis

const express = require('express');
const dbSingleton = require('../dbSingleton');
const router = express.Router();
const db = dbSingleton.getConnection();

const { isAuthenticated, canModifyArticle, upload } = require('./middlewares');


/* ------------------------------------- SEARCH ARTICLES ---------------------------------------------- */
// GET /api/articles
// Returns a list of all articles
// Requires you to be logged-in
router.get('/', isAuthenticated, (req, res) => {
    const query = 'SELECT * FROM articles';
    // Query to get all articles
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to get articles!' });
        }
        // Return all the articles
        return res.json(result);
    })
});

// GET /api/articles/search
// Returns articles based on search criteria provided in req.query
// If multiple search criteria is given, only the FIRST is considered.
// Requires you to be logged-in
router.get('/search', isAuthenticated, (req, res) => {
    // Find the FIRST relevant query to search articles
    let keyword = undefined, value = undefined;
    for (const [key, val] of Object.entries(req.query)) {
        // Only accept these queries
        if (!["id", "title", "author", "type"].includes(key)) continue;
        else {
            keyword = key;
            value = (key === "title") ? `%${val}%` : val; // so it works with LIKE operator
            break;
        }
    }
    // If no relevant query was found in req.query, exit with error message
    if (keyword === undefined || value === undefined) 
        return res.status(500).json({"error": `Invalid queries, could not find article.`});

    // Helper object to get the appropriate SQL query
    const queries = {
        "id": "SELECT * FROM articles WHERE id = ?",
        "title": "SELECT * FROM articles WHERE title LIKE ?",
        "author": "SELECT * FROM articles WHERE author = ?",
        "type": "SELECT * FROM articles WHERE type = ?"
    }

    // Send the appropriate query and value to the database
    db.query(queries[keyword], [value], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to get articles.' });
        }

        // If we can't find an article within the search criteria, send a clear error message
        else if (result.length === 0) return res.status(404).json({"error": `Article with ${keyword} = ${value} not found.`})

        // Otherwise return the result
        return res.json(result);
    })
})

// GET /api/articles/:id
// Returns an article by id
// Requires you to be logged-in
router.get('/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM articles WHERE id = ?';
    // Query to get article
    db.query(query, [Number(id)], (err, result) => {
        if (err) {
            return res.status(500).json({ error: `Failed to execute query!` });
        }

        // If we can't find an article with the id
        else if (result.length === 0) return res.status(404).json({"error": `Article with id = ${id} not found.`});

        // Return the article
        return res.json(result);
    })
});

/* ------------------------------------- Create / Edit / Delete ARTICLES ---------------------------------------------- */
// POST /api/articles
// Creates a new article inside the table
// Requires you to be logged-in
router.post('/', isAuthenticated, upload.single('image'), async (req, res) => {
    const { title, description, content, author, type } = req.body;
    if (!title || !description || !content || !author || !type) 
        return res.status(500).json({"error": 'Invalid values, failed to insert new article.'});
    
    // If we have an image attached, get the imagePath to save in the database, 
    // otherwise send null (acceptable in our SQL table)
    const imagePath = req.file ? `/images/${req.file.filename}` : null;

    const query = 'INSERT INTO articles (title, description, content, author, type, image_path) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [title, description, content, author, type, imagePath], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to insert new article!' });
        }
        return res.json({"message": "Successfully inserted a new article." });
    })
})

// PUT /api/articles/:id
// Updates an article inside the table by id
// Requires you to be the article owner / an admin user
router.put('/:id', isAuthenticated, canModifyArticle, upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { title, description, content, author, type, removeImage } = req.body;

    // Validate required fields (image is optional, removeImage is optional)
    if (!title || !description || !content || !author || !type) {
        return res.status(500).json({ error: 'Missing required fields for update.' });
    }

    // Begin constructing the SQL update components and the corresponding values
    let fields = ["title = ?", "description = ?", "content = ?", "author = ?", "type = ?"];
    let values = [title, description, content, author, type];

    // Case 1: A new image was uploaded
    if (req.file) {
        fields.push("image_path = ?");
        values.push(`/images/${req.file.filename}`);
    }
    
    // Case 2: No new image, but the removeImage flag indicates the image should be removed
    else if (removeImage && removeImage.toString().toLowerCase() === "true") {
        fields.push("image_path = ?");
        values.push(null);
    }
    
    // Otherwise, do not modify the existing image_path (by not adding it to our SQL query)

    // Always update the updated_at timestamp
    fields.push("updated_at = NOW()");

    // Build the final SQL query dynamically
    const query = `UPDATE articles SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    // Execute the update query
    db.query(query, values, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update article.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Article with id = ${id} not found.` });
        }
        return res.json({ message: `Successfully updated article with id = ${id}.`, article: result });
    });
});

// DELETE /api/articles/:id
// Deletes an article by id
// Requires you to be the article owner / an admin user
router.delete('/:id', isAuthenticated, canModifyArticle, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM articles WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: `Failed to execute delete.` });
        }

        // If we can't find an article with the provided ID
        if (result.affectedRows === 0) 
            return res.status(404).json({ error: `Failed to find and delete article with ID=${id}`});
        
        // Otherwise return a success message
        return res.json({"message": `Successfully deleted article with ID=${id}`});
    })
})

/* ------------------------------------- GET SORTED ARTICLES ---------------------------------------------- */
// GET /api/articles/ordered/created_at
// Returns a list of all articles ordered by created_at
router.get('/ordered/created_at', isAuthenticated, (req, res) => {
    const query = 'SELECT * FROM articles ORDER BY created_at DESC;';
    // Query to get all articles ordered by created_at
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to get articles!' });
        }
        // Return all the ordered articles
        return res.json(result);
    })
});

// GET /api/articles/ordered/updated_at
// Returns a list of all articles ordered by updated_at
router.get('/ordered/updated_at', isAuthenticated, (req, res) => {
    const query = 'SELECT * FROM articles ORDER BY updated_at DESC;';
    // Query to get all articles ordered by updated_at
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to get articles!' });
        }
        // Return all the ordered articles
        return res.json(result);
    })
});


module.exports = router;
