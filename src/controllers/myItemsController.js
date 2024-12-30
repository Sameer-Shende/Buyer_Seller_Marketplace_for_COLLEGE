const Product = require('../models/product');
const LostProduct = require('../models/lostProduct');
const NeededProduct = require('../models/neededProduct');

exports.getMyItems = async (req, res) => {
    try {
        const email = req.user.email;

        // Fetch products, lost items, and needed items created by the user
        const products = await Product.find({ email }).lean();
        const lostItems = await LostProduct.find({ email }).lean();
        const neededItems = await NeededProduct.find({ email }).lean();

        res.render('my_items', { products, lostItems, neededItems, messages: req.flash() });
    } catch (error) {
        console.error('Error fetching items:', error);
        req.flash('error', 'Failed to fetch items. Please try again.');
        res.redirect('/');
    }
};

exports.updateItemStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { itemType, newStatus } = req.body;

        let model;
        switch (itemType) {
            case 'product':
                model = Product;
                break;
            case 'lostProduct':
                model = LostProduct;
                break;
            case 'neededProduct':
                model = NeededProduct;
                break;
            default:
                req.flash('error', 'Invalid item type.');
                return res.redirect('/my-items');
        }

        await model.findByIdAndUpdate(id, { status: newStatus });

        req.flash('success', 'Item status updated successfully!');
        res.redirect('/my-items');
    } catch (error) {
        console.error('Error updating item status:', error);
        req.flash('error', 'Failed to update item status. Please try again.');
        res.redirect('/my-items');
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { itemType } = req.body;

        let model;
        switch (itemType) {
            case 'product':
                model = Product;
                break;
            case 'lostProduct':
                model = LostProduct;
                break;
            case 'neededProduct':
                model = NeededProduct;
                break;
            default:
                req.flash('error', 'Invalid item type.');
                return res.redirect('/my-items');
        }

        await model.findByIdAndDelete(id);

        req.flash('success', 'Item deleted successfully!');
        res.redirect('/my-items');
    } catch (error) {
        console.error('Error deleting item:', error);
        req.flash('error', 'Failed to delete item. Please try again.');
        res.redirect('/my-items');
    }
};
