// Loaie Shalloufi
// Tareq Abu Yunis

const express = require('express');
const dbSingleton = require('../dbSingleton');
const router = express.Router();
const db = dbSingleton.getConnection();


/* ------------------------------------- SEARCH ARTICLES ---------------------------------------------- */
// GET /api/articles
// Returns a list of all articles
router.get('/', (req, res) => {
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
router.get('/search', (req, res) => {
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
router.get('/:id', (req, res) => {
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
router.post('/', (req, res) => {
    const { title, description, content, author, type, image_path } = req.body;
    if (!title || !description || !content || !author || !type || !image_path) 
        return res.status(500).json({"error": 'Invalid values, failed to insert new article.'});

    const query = 'INSERT INTO articles (title, description, content, author, type, image_path) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [title, description, content, author, type, image_path], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to insert new article!' });
        }
        return res.json({"message": "Successfully inserted a new article.", "article": result});
    })
})

// PUT /api/articles/:id
// Updates an article inside the table by id
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, content, author, type, image_path } = req.body;

    // Validate that all required fields are provided
    if (!title || !description || !content || !author || !type || !image_path) {
        return res.status(500).json({ error: 'Missing required fields for update.' });
    }

    // Update query that also sets updated_at to the current time
    const query = `
        UPDATE articles
        SET title = ?, description = ?, content = ?, author = ?, type = ?, image_path = ?, updated_at = NOW()
        WHERE id = ?
    `;

    // Execute the update query
    db.query(query, [title, description, content, author, type, image_path, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update article.' });
        }

        // If no rows were affected, then the article wasn't found
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Article with id = ${id} not found.` });
        }

        // Return success message along with query result info
        return res.json({ message: `Successfully updated article with id = ${id}.`, article: result });
    });
});

// DELETE /api/articles/:id
// Deletes an article by id
router.delete('/:id', (req, res) => {
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
router.get('/ordered/created_at', (req, res) => {
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
router.get('/ordered/updated_at', (req, res) => {
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
