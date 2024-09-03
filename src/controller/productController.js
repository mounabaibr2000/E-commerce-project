const Product = require('../models/productModel'); // Assuming you have a Product model
const Order = require('../models/orderModel'); 


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

    // Log the file details for debugging
    console.log('Uploaded File Details:', req.file);

    // Get the Cloudinary URL for the uploaded image
    const productImageUrl = req.file.path;

    // Log the URL for debugging
    console.log('Product Image URL:', productImageUrl);

    // Create a new product instance
    const newProduct = new Product({
      productName,
      brandName,
      category,
      description,
      price,
      sellingPrice,
      images: [productImageUrl], // Save the Cloudinary URL in the database
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


// Assuming you have a Product model

exports.getProduct = async (req, res) => {
    try {
        // Extract the product ID from the request parameters
        const productId = req.params.id;

        // Find the product by ID
        const product = await Product.findById(productId);

        // Check if the product was found
        if (!product) {
            return res.status(404).json({
                message: "Product not found.",
                error: true,
                success: false,
            });
        }

        // Render the update product form and pass the product data
        res.render('admin/updateProduct', { product });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            message: "An error occurred while retrieving the product.",
            error: true,
            success: false,
        });
    }
};


// Handle updating an existing product
exports.updateProduct = async (req, res) => {
  console.log('Reached updateProduct route');
  // The rest of your code...
  try {
    console.log('Request Body:', req.body); // Log the request body
    console.log('Request File:', req.file); // Log the uploaded file
    const { productName, brandName, category, description, price, sellingPrice } = req.body;
    console.log('updateProduct function called');

    // Validate that all required fields are present
    if (!productName || !brandName || !category || !description || !price || !sellingPrice) {
      return res.status(400).json({
        message: "All fields are required.",
        error: true,
        success: false,
      });
    }

    // Check if a file is uploaded
    let productImageUrl;
    if (req.file) {
      // Log the file details for debugging
      console.log('Uploaded File Details:', req.file);

      // Assuming you're using a service like Cloudinary and the path is returned in req.file.path
      productImageUrl = req.file.path;

      // Log the URL for debugging
      console.log('Product Image URL:', productImageUrl);
    }

    // Find the product by ID and update it
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        productName,
        brandName,
        category,
        description,
        price,
        sellingPrice,
        ...(productImageUrl && { images: [productImageUrl] }) // Only update image if a new one was uploaded
      },
      { new: true, runValidators: true } // Return the updated document and apply schema validations
    );

    // Check if the product was found and updated
    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found.",
        error: true,
        success: false,
      });
    }

    // Send a success response with the updated product data
    res.status(200).json({
      message: "Product updated successfully",
      error: false,
      success: true,
      data: updatedProduct,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      message: "An error occurred while updating the product.",
      error: true,
      success: false,
    });
  }
};

// Handle deleting a product
// In adminController.js
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
      await Product.findByIdAndDelete(id);
      res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting product' });
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
