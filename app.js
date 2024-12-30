const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();
require('./src/utils/db'); // MongoDB connection

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: `${process.env.SESSION_SECRET}`, resave: false, saveUninitialized: true }));
app.use(flash());
app.use(require('./src/middlewares/flashMiddleware').addFlashMessages);
const productRoutes = require('./src/routes/productRoutes'); // Update path as needed
app.use('/', productRoutes);  // Use the routes defined in productRoutes.js
app.use(passport.initialize());
app.use(passport.session());  
// Routes
app.use('/', require('./src/routes/indexRoutes'));
app.use('/', require('./src/routes/myItemsRoutes'));
// Server
app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));
