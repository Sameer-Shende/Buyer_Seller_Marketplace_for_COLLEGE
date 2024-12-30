const bcrypt = require('bcrypt');
const Student = require('../models/student');
const Product = require('../models/product');
const LostProduct = require('../models/lostProduct');
const NeededProduct = require('../models/neededProduct');
exports.editProfile = async (req, res) => {
    try {
        const { oldPassword, name, password, room } = req.body;
        const userId = req.user.id; // Ensure you have user authentication/session in place

        // Fetch user from the database
        const user = await Student.findById(userId);
        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/edit-profile');
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            req.flash('error', 'Incorrect old password.');
            return res.redirect('/edit-profile');
        }

        // Update user details
        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (room) updatedFields.room = room;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(password, salt);
        }

        Object.assign(user, updatedFields);
        await user.save();

        // Update all related products, lost items, and needed items
        const userEmail = user.email;

        // Update products
        await Product.updateMany(
            { email: userEmail },
            { $set: { ownerName: name, room } }
        );

        // Update needed products
        await NeededProduct.updateMany(
            { email: userEmail },
            { $set: { ownerName: name, room } }
        );

        // Update lost products
        await LostProduct.updateMany(
            { email: userEmail },
            { $set: { ownerName: name, room } }
        );

        req.flash('success', 'Profile updated successfully.');
        res.redirect('/edit-profile');
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while updating the profile.');
        res.redirect('/edit-profile');
    }
};