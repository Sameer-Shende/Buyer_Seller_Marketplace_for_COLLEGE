const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Student = require('../models/student');
const Product = require('../models/product');
const LostProduct = require('../models/lostProduct');
const NeededProduct = require('../models/neededProduct');

const JWT_SECRET = `${process.env.JWT_SECRET}`;

exports.createAccount = async (req, res) => {
    const { name, email, password, mobile, room } = req.body;

    try {
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            req.flash('error', 'Email is already registered.');
            return res.redirect('/create');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = new Student({ name, email, password: hashedPassword, mobile, room });
        await newStudent.save();

        req.flash('success', 'Account created successfully. You can now log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error creating account:', error);
        req.flash('error', 'An error occurred. Please try again.');
        res.redirect('/create');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Student.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'Invalid email or password.');
            return res.redirect('/');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid email or password.');
            return res.redirect('/');
        }

        // Include the user's name in the token payload
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email },  // Add the 'name' here
            JWT_SECRET
        );

        res.cookie('auth_token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });  // Set the cookie with the token

        req.flash('success_msg', 'Login successful!');
        res.redirect('/products');
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error_msg', 'An error occurred. Please try again.');
        res.redirect('/');
    }
};

exports.deleteAccount = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Student.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'No account found with that email.');
            return res.redirect('/delete-account');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Incorrect password. Please try again.');
            return res.redirect('/delete-account');
        }

        // Delete the user's products
        await Product.deleteMany({ email }); // General products
        await NeededProduct.deleteMany({ email }); // Needed products
        await LostProduct.deleteMany({ email }); // Lost products

        // Delete the user account
        await Student.findByIdAndDelete(user._id);

        res.clearCookie('auth_token'); // Logout user after deletion
        req.flash('success_msg', 'Account and all associated products deleted successfully.');
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting account:', error);
        req.flash('error_msg', 'An error occurred. Please try again.');
        res.redirect('/delete-account');
    }
};


exports.logout = (req, res) => {
    res.clearCookie('auth_token');
    req.flash('success_msg', 'Logged out successfully.');
    res.redirect('/');
};
