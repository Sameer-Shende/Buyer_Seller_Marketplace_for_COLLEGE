const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');
const path = require('path');
const dayjs =  require('dayjs')
const { isLoggedIn } = require('../middlewares/authMiddleware');
const Product = require('../models/product');
const LostProduct = require('../models/lostProduct');
const NeededProduct = require('../models/neededProduct');
const Student =  require('../models/student')

// Routes for Products

router.get('/create-product', isLoggedIn, productController.createProduct);
router.get('/create-lost-product', isLoggedIn, productController.createLostProduct);
router.get('/create-needed-product', isLoggedIn, productController.createNeededProduct);

router.get('/products', isLoggedIn, async (req, res) => {
    const type = req.query.type || 'buy'; // Default type is 'buy'
    const filters = {
        category: req.query.category || 'all',
        minPrice: parseFloat(req.query.minPrice) || 0,
        maxPrice: parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER,
        sort: req.query.sort || 'newest',
    };

    let products = [];

    try {
        let query = {};
        // Filter by productCategory (correct field name)
        if (filters.category !== 'all') {
            const s = String(filters.category).charAt(0).toUpperCase() + String(filters.category).slice(1);
            query.productCategory = s;
        }

        // Filter by price range
        
        // Fetch products based on type
        if (type === 'buy') {
            query.price = { $gte: filters.minPrice, $lte: filters.maxPrice };
            products = await Product.find(query).sort(
                filters.sort === 'newest'
                    ? { createdAt: -1 }
                    : filters.sort === 'oldest'
                    ? { createdAt: 1 }
                    : filters.sort === 'price-asc'
                    ? { price: 1 }
                    : { price: -1 }
            );
        } else if (type === 'lost') {
            products = await LostProduct.find(query).sort({ createdAt: -1 });
        } else if (type === 'needed') {
            products = await NeededProduct.find(query).sort({ createdAt: -1 });
        }

        res.render('index', { products, type, activeType: type, filters});
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Failed to load products' });
    }
});


// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Save files to public/uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid filename conflicts
    },
});

const upload = multer({ storage: storage });

// POST route for creating a new product
router.post('/submit-product', isLoggedIn, upload.array('images', 5), async (req, res) => {
    const { productName, productCategory, productCommonName, usage, originalPrice, price, title, description } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`); // Save image paths

    try {
        // Access the logged-in user's email from req.user
        const email = req.user.email;

        // Fetch the student details based on the email
        const student = await Student.findOne({ email }).exec();

        if (!student) {
            req.flash('error', 'Student profile not found. Please try again.');
            return res.redirect('/create-product');
        }

        // Destructure required fields from the student document
        const { name, mobile, room } = student;

        // Create a new product document
        const newProduct = new Product({
            productName,
            productCategory,
            productCommonName,
            usage,
            originalPrice,
            price,
            images,
            title,
            description,
            status: 'Not Sold', // Default to 'Not Sold'
            ownerName: name,    // Use the student's name as the owner name
            email,              // Use the student's email
            mobile,             // Use the student's mobile number
            room,               // Use the student's room number
        });

        // Save the product document
        await newProduct.save();

        // Add the product to the student's listedProducts array
        student.listedProducts.push(newProduct._id);
        await student.save();

        req.flash('success', 'Product created successfully!');
        res.redirect('/products'); // Redirect to /products page to see the new product
    } catch (error) {
        console.error('Error creating product:', error);
        req.flash('error', 'Failed to create product. Please try again.');
        res.redirect('/create-product');
    }
});



router.post('/submit-lost-item', isLoggedIn, upload.array('images', 5), async (req, res) => {

    const { productName, productCategory, productCommonName, status, lostLocation, title, description, lostDate, lostTime } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`);

    try {
        // Format the date to YYYY-MM-DD (or another desired format)
        const email = req.user.email;

        // Fetch the student details based on the email
        const student = await Student.findOne({ email }).exec();
        if (!student) {
            req.flash('error', 'Student profile not found. Please try again.');
            return res.redirect('/create-product');
        }

        // Destructure required fields from the student document
        const { name, mobile, room } = student;

        const newLostProduct = new LostProduct({
            productName,
            productCategory,
            productCommonName,
            status,
            lostLocation,
            images,
            title,
            description,
            lostDate,
            ownerName: name,
            mobile,
            email,
            room,
            lostTime,
        });

        await newLostProduct.save();

        req.flash('success', 'Lost item created successfully!');
        res.redirect('/products?type=lost'); // Adjust as per your route
    } catch (error) {
        console.error('Error submitting lost item:', error);
        req.flash('error', 'Failed to submit lost item. Please try again.');
        res.redirect('/submit-lost-item'); // Adjust as per your route
    }
});


router.post('/submit-needed-product', isLoggedIn, upload.array('images', 5), async (req, res) => {
    const { 
        productName, 
        productCategory, 
        productCommonName, 
        status, 
        title, 
        description, 
        neededBy, 
        willingToPayUpto, 
        additionalNotes 
    } = req.body;

    const images = req.files.map(file => `/uploads/${file.filename}`);
    const whoNeeds = req.user ? req.user.name : 'Unknown';

    try {
        // Fetch additional details from the Student schema
        const student = await Student.findOne({ email: req.user.email }).lean().exec();

        if (!student) {
            req.flash('error', 'User details not found. Please try again.');
            return res.redirect('/submit-needed-product');
        }

        const newNeededProduct = new NeededProduct({
            productName,
            productCategory,
            productCommonName,
            status,
            images,
            title,
            description,
            neededBy,
            whoNeeds,
            email: student.email,
            mobile: student.mobile,
            room: student.room,
            willingToPayUpto,
            additionalNotes,
        });

        await newNeededProduct.save();

        req.flash('success', 'Needed product submitted successfully!');
        res.redirect('/products?type=needed'); // Redirect to the needed products page
    } catch (error) {
        console.error('Error submitting needed product:', error);
        req.flash('error', 'Failed to submit needed product. Please try again.');
        res.redirect('/submit-needed-product'); // Redirect back to the form
    }
});


router.get('/buy-product-details/:id', isLoggedIn, async (req, res) => {
    try {
        // Fetch the product by ID
        const product = await Product.findById(req.params.id).lean().exec();

        // If the product is not found, redirect with an error
        if (!product) {
            req.flash('error', 'Product not found!');
            return res.redirect('/products');
        }

        // Render the product details with owner info included in the product document
        res.render('product_details', { product });
    } catch (error) {
        console.error('Error fetching product details:', error);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/products');
    }
});

// // Needed product details route
router.get('/needed-product-details/:id', isLoggedIn, async (req, res) => {
    try {
        // Fetch the needed product by its ID
        const neededProduct = await NeededProduct.findById(req.params.id).lean().exec();

        // If the needed product is not found
        if (!neededProduct) {
            req.flash('error', 'Needed product not found!');
            return res.redirect('/products?type=needed');
        }

        // Render the product details page with the needed product's data
        res.render('needed_product_details', { neededProduct });
    } catch (error) {
        console.error('Error fetching needed product details:', error);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/products?type=needed');
    }
});


// Lost product details route
router.get('/lost-product-details/:id', isLoggedIn, async (req, res) => {
    try {
        // Fetch the lost product by its ID
        const lostProduct = await LostProduct.findById(req.params.id).lean().exec();

        // If the lost product is not found
        if (!lostProduct) {
            req.flash('error', 'Lost product not found!');
            return res.redirect('/products?type=lost');
        }

        // Render the product details page with the lost product's data
        res.render('lost_product_details', { lostProduct });
    } catch (error) {
        console.error('Error fetching lost product details:', error);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/products?type=lost');
    }
});


module.exports = router;
