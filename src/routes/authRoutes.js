const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { editProfile } = require('../controllers/editProfileController');
const Product = require('../models/product');
const { isLoggedIn } = require('../middlewares/authMiddleware');
router.get('/', (req, res) => res.render('login'));
router.get('/create', (req, res) => res.render('create'));
router.post('/create-account', authController.createAccount);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/delete-account', (req, res) => res.render('delete_account'));
router.post('/delete-account', authController.deleteAccount);

router.get('/edit-profile', isLoggedIn, (req, res) => {
    res.render('edit-profile', { 
        user: req.user, // Assuming user info is added to req.user by middleware
        messages: {
            success: req.flash('success'),
            error: req.flash('error'),
        },
    });
});

router.post('/edit-profile', isLoggedIn, editProfile);
module.exports = router;

