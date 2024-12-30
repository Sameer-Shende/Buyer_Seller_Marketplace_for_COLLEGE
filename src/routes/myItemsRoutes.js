const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/authMiddleware');
const myItemsController = require('../controllers/myItemsController');

// Route to fetch all items
router.get('/my-items', isLoggedIn, myItemsController.getMyItems);

// Route to update item status
router.post('/update-item-status/:id', isLoggedIn, myItemsController.updateItemStatus);

// Route to delete an item
router.post('/delete-item/:id', isLoggedIn, myItemsController.deleteItem);

module.exports = router;
