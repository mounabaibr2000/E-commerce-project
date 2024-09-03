// controllers/cartController.js
const Product = require('../models/productModel');
const Cart=require("../models/cartModel");
const mongoose=require('mongoose');
// Example function to add to cart


exports.viewCart = async (req, res) => {
  try {
 
    const cart = await Cart.findOne({ user: req.user.id }).populate('products');
   
    
    // Fetch the cart for the user
    // const cart = await Cart.findOne({ userId: req.user.id }).populate('products');
    
    // console.log('Fetched Cart:', cart);

    if (!cart) {
      console.log('Cart not found');
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.render('cart', { 
      cart: cart || { products: [] }, 
      updateSuccess: req.query.updateSuccess || false 
    });
  } catch (error) {
    console.error('Error fetching cart data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.addToCart = async (req, res) => {
  try {
      const productId = req.params.productId;
      const userId = req.user.id;

      if (!userId) {
          return res.status(400).send('User not authenticated');
      }

      const product = await Product.findById(productId);

      if (!product) {
          return res.status(404).send('Product not found');
      }

      let cart = await Cart.findOne({ user: userId });

      if (cart) {
          const cartItem = cart.products.find(item => item.product.toString() === productId);

          if (cartItem) {
              cartItem.quantity += 1;
          } else {
              cart.products.push({
                  product: product._id,
                  quantity: 1,
                  price: product.price,
                  productName: product.productName,
              });
          }
      } else {
          cart = new Cart({
              user: userId,
              products: [{
                  product: product._id,
                  quantity: 1,
                  price: product.price,
                  productName: product.productName,
              }]
          });
      }

      await cart.save();

      // Save the updated cart to cookies
      res.cookie('cart', JSON.stringify(cart.products), { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // Cookie expires in 24 hours

      res.redirect('/cart');
  } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).send('Server Error');
  }
};








exports.updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Fetch the cart for the user
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).send('Cart not found');
    }

    // Log the cart contents and productId to ensure we're working with the right data
    console.log('Cart contents:', cart.products);
    console.log('Product ID from request:', productId);

    // Find the cart item based on the `productId` which is actually `_id` of the cart item
    const cartItem = cart.products.find(item => item._id.toString() === productId);

    if (cartItem) {
      // Log the cart item to ensure we're updating the correct item
      console.log('Found cart item to update:', cartItem);

      // If the cart item exists, update the quantity
      cartItem.quantity = quantity;

      // Save the updated cart
      await cart.save();

      // Optionally, save the updated cart to cookies as well
      res.cookie('cart', JSON.stringify(cart), { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // Cookie expires in 24 hours

      // Redirect to the cart page or send a response
      res.redirect('/cart?updateSuccess=true');
    } else {
      console.log('Product not found in cart for the given productId:', productId);
      return res.status(400).send('Product not found in cart');
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).send('Server Error');
  }
};










exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    // Find the user's cart in the database
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).send('Cart not found');
    }

    // Filter out the product with the specified productId from the cart's products array
    cart.products = cart.products.filter(item => item._id.toString() !== productId);

    // Save the updated cart back to the database
    await cart.save();

    // Optionally, you can update the cart in the cookies as well
    res.cookie('cart', JSON.stringify(cart), { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    // Redirect back to the cart page
    res.redirect('/cart');
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).send('Server Error');
  }
};

