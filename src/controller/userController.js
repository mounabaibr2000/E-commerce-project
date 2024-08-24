const User=require("../models/userModel");
const productModel=require("../models/productModel");
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
        res.render("shop");
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
exports.checkOutPage = async (req, res) => {
    try {
        res.render("checkout");
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
    console.log(req.body); // Debugging: Check the request body

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
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Redirect to home or another protected route
        console.log('Redirecting to home');
        return res.status(200).json({ message: 'Login successful', redirectUrl: '/home' });

    } catch (error) {
        console.error('Login error:', error.message);
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
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/userLogin'); // Redirect to login or another appropriate page
  };
  
