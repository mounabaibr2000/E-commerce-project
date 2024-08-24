const Product = require('../models/productModel'); // Assuming you have a Product model
const Order = require('../models/orderModel'); 
const cloudinary = require('../middleware/cloudinaryConfig');
const Admin = require('../models/adminModel')

// Display the form to add a new product
exports.getAddProduct = (req, res) => {
    res.render('admin/addProduct', { title: 'Add Product' });
};

// Handle adding a new product
const path = require('path');

exports.uploadProduct = async (req, res) => {
  try {
    const { productName, brandName, category, description, price, sellingPrice } = req.body;
    console.log('uploadProduct function called');

    // Check if a file is uploaded
    if (!req.file) {
      throw new Error('No file uploaded. Please upload a product image.');
    }
    console.log('Uploaded File Details:', req.file);

    const productImagePath = req.file.path;

    // Log the path for debugging
    console.log('Product Image Path:', productImagePath);

    // Create a new product instance
    const newProduct = new Product({
      productName,
      brandName,
      category,
      description,
      price,
      sellingPrice,
      images: [productImagePath], // Save the file path as an array in the database
    });

    // Save the product to the database
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product uploaded successfully",
      error: false,
      success: true,
      data: savedProduct,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};


// Display the form to update an existing product
exports.getUpdateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.render('admin/updateProduct', { title: 'Update Product', product });
    } catch (error) {
        res.status(500).send('Error fetching product');
    }
};

// Handle updating an existing product
exports.postUpdateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stockQuantity } = req.body;
        await Product.findByIdAndUpdate(req.params.id, { name, description, price, category, stockQuantity });
        res.redirect('/admin/products');
    } catch (error) {
        res.status(500).send('Error updating product');
    }
};

// Handle deleting a product
exports.postDeleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndRemove(req.params.id);
        res.redirect('/admin/products');
    } catch (error) {
        res.status(500).send('Error deleting product');
    }
};

// Fetch and display all products (optional)
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin/products', { title: 'All Products', products });
    } catch (error) {
        res.status(500).send('Error fetching products');
    }
};
