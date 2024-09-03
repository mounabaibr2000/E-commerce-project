const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const adminController=require("../controller/adminController");
const {verifyadminToken} = require("../middleware/adminTokenVerify");


const upload=require("../middleware/upload");

// Route to display the add product form
router.get('/addProduct',verifyadminToken, productController.getAddProduct);

// Route to handle adding a new product
router.post('/addProduct', upload.single('productImage'), productController.uploadProduct);



// Route to handle updating an existing product
router.get('/updateProduct/:id', productController.getProduct);
router.get('/products',verifyadminToken,productController.getAllProducts)
router.put('/updateProduct/:id', upload.single('productImage'),productController.updateProduct);

// Route to handle deleting a product
router.delete('/deleteProduct/:id', productController.deleteProduct);


module.exports = router;
