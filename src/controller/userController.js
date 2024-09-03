const User=require("../models/userModel");
const Product=require("../models/productModel");
const Order=require("../models/orderModel");

const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'mysecretkey';


exports.indexPage=async(req,res)=>{
    try {
        res.render("first");
    } catch (err) {
        console.log(err.stack);
        res.status(500).send("Something went wrong" + err.mesaage);
    }
}
exports.homePage = async (req, res) => {
    try {
        res.render("home");
    } catch (err) {
        console.log(err.stack);
        res.status(500).send("Something went wrong" + err.mesaage);
    }

}
exports.shopPage = async (req, res) => {
    try {
        const products = await Product.find();
        const userId = req.user ? req.user.id : null; 
        res.render('shop', {
            products,
            userId  // Pass user ID to the EJS template
          });
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Something went Wrong" + err.message);
    }
}

exports.blogDetailsPage = async (req, res) => {
    try {
        res.render("blogDetails");
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Something went Wrong" + err.message);
    }
}
exports.blogPage = async (req, res) => {
    try {
       
        res.render("blog");
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Something went Wrong" + err.message);
    }
}


exports.mainPage = async (req, res) => {
    try {
        res.render("main");
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Something went Wrong" + err.message);
    }
}
exports.cartPage = async (req, res) => {
    try {
        res.render("cart");
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Something went Wrong" + err.message);
    }
}
exports.contactPage = async (req, res) => {
    try {
        res.render("contact");
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Something went Wrong" + err.message);
    }
}
exports.productDetailPage = async (req, res) => {
    try {
        res.render("product");
    }
    catch (err) {
        console.log(err.stack);
        res.status(500).send("Something went Wrong" + err.message);
    }
}
exports.getuserlogin=async(req,res)=>{
    res.render("userlogin");
}
exports.postuserlogin = async (req, res) => {
    const { username, password } = req.body;
    console.log('Request Body:', req.body); // Debugging: Check the request body

    try {
        // Fetch the user from the database
        const user = await User.findOne({ username });
        console.log('User found:', user); // Debugging: Log the fetched user

        // Check if the user exists
        if (!user) {
            console.log('Username not found'); // Debugging: Log when the user is not found
            return res.render('userLogin', { errorMessage: 'Invalid username or password' });
        }

        // Validate the password
        const isPasswordValid = await user.comparePassword(password);
        console.log('Password valid:', isPasswordValid); // Debugging: Log password validation result

        if (!isPasswordValid) {
            console.log('Invalid password'); // Debugging: Log invalid password
            return res.render('userLogin', { errorMessage: 'Invalid username or password' });
        }

        // Generate the token
        const payload = {
            id: user._id,
            username: user.username,
            role: user.role,
        };

        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
        console.log('Generated Token:', token);

        // Set token in HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Ensure this is set correctly
            sameSite: 'strict'
        });

        // Redirect to home or another protected route
        console.log('Redirecting to home');
        return res.status(200).json({ message: 'Login successful', redirectUrl: '/home' });

    } catch (error) {
        console.error('Login error:', error); // Log full error object for debugging
        return res.render('userLogin', { errorMessage: 'An error occurred. Please try again.' });
    }
};

  exports.getusersignup=async(req,res)=>{
    res.render("userSignup");

}
exports.postusersignup = async (req, res) => {
  const { fullName, mobileNumber, username, email, password, dob, address } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ errorMessage: 'Email or username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      fullName,
      mobileNumber,
      username,
      email,
      password,
      dob,
      address
    });

    await newUser.save();

    // Handle successful signup (e.g., redirect to login page)
    res.status(201).json({ message: 'Signup successful', redirectUrl: '/userlogin' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ errorMessage: 'An error occurred. Please try again.' });
  }
};


exports.getUserDashboard = async (req, res) => {
    try {
      // Fetch user data
      const user = await User.findById(req.user.id);
      
      // Fetch user orders
      const orders = await Order.find({ userId: req.user.id });
      
      // Fetch cart from cookies or initialize an empty array if it doesn't exist
      const cartCookie = req.cookies.cart;
      let cart = [];
  
      if (cartCookie) {
        try {
          cart = JSON.parse(cartCookie);
        } catch (error) {
          console.error('Error parsing cart cookie:', error);
          cart = []; // Initialize as empty array if there's an error
        }
      }
  
      // Render the user dashboard with user data, orders, and cart
      res.render('userDashboard', {
        user,
        orders,
        cart, // Pass the cart data to the view
      });
    } catch (error) {
      console.error('Error fetching user dashboard data:', error);
      res.status(500).send('Server Error');
    }
  };
  
  exports.getCheckout = async (req, res) => {
    try {
        // Retrieve cart items from cookies
        const cartItems = req.cookies.cartItems || [];
        const parsedCartItems = Array.isArray(cartItems) ? cartItems : JSON.parse(cartItems);

        console.log('Cart Items:', parsedCartItems); // Debugging

        if (parsedCartItems.length === 0) {
            return res.render('checkout', { products: [], subtotal: 0, cartItems: [] });
        }

        // Fetch the products from the database
        const products = await Product.find({ _id: { $in: parsedCartItems.map(item => item.productId) } });

        console.log('Products:', products); // Debugging

        // Calculate the subtotal
        const subtotal = products.reduce((acc, product, index) => {
            const quantity = parsedCartItems[index]?.quantity || 0;
            return acc + product.price * quantity;
        }, 0);

        console.log('Subtotal:', subtotal); // Debugging

        // Render the checkout page with products and subtotal
        res.render('checkout', { products, subtotal, cartItems: parsedCartItems });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};


exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/userLogin'); // Redirect to login or another appropriate page
  };
  

   // Assuming you have a Product model
  

  