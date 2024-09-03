// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const {verifyToken} = require("../middleware/tokenVerify");

// Cart Routes
router.post('/add-to-cart/:productId',verifyToken, cartController.addToCart);
router.get('/cart', verifyToken,cartController.viewCart);
router.post('/update-cart',verifyToken, cartController.updateCart);
router.post('/remove-from-cart', verifyToken,cartController.removeFromCart);

module.exports = router;
