// Loaie Shalloufi
// Tareq Abu Yunis

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const path = require('path');
const articleRoutes = require('./routes/articles');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contact');

const port = process.env.PORT || 3000;

// Middlewares and setups
// Increase the limit to 10MB (or adjust as needed)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static('public'));
app.use(
    '/images',
    express.static(path.join(__dirname, 'data', 'images'))
);

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 day, adjust as needed
        secure: false, // Set true if using HTTPS
      }
}));
app.use(cors({
  origin: 'http://localhost:5000', // Frontend URL
  credentials: true, // For using Sessions
}));

// Routers
app.use('/api/articles', articleRoutes); // All article routes
app.use('/api/users', userRoutes); // All user routes
app.use('/api/contact', contactRoutes); // All contact routes

// Main Page
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Main Page</h1>');
});

// Processing route 404
app.use((req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
