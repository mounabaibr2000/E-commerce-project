const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const upload=require("../middleware/upload");

// Route to display the add product form
router.get('/addProduct', productController.getAddProduct);

// Route to handle adding a new product
router.post('/addProduct', upload.single('productImage'), productController.uploadProduct);

// Route to display the update product form
router.get('/updateProduct', productController.getUpdateProduct);

// Route to handle updating an existing product
router.post('/updateProduct/:id', productController.postUpdateProduct);

// Route to handle deleting a product
router.post('/deleteProduct/:id', productController.postDeleteProduct);

// Route to fetch and display all products (optional)
router.get('/', productController.getAllProducts);

module.exports = router;
