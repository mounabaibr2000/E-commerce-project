require('dotenv').config();


const express = require("express");
const cors = require('cors');


const bodyParser=require('body-parser');
const cookieParser = require('cookie-parser');
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("./config/dataBase");
const Product = require("./models/productModel");
const userRoutes = require("./routes/userRoutes");
const adminRoutes=require("./routes/adminRoutes");
const productRoutes = require('./routes/productRoutes');
const cartRoutes=require("./routes/cartRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandling");
// const cloudinary = require('../middleware/cloudinaryConfig');
const app = express();
app.use(cors());
app.use(cookieParser());
// Connect to the database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json()); // Add this line to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Use user and admin routes
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});
app.get('/favicon.ico', (req, res) => res.status(204));
app.use('/',cartRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);
app.use('/admin', productRoutes);




// Error handling middleware
app.use(notFound);
app.use(errorHandler);
console.log('Port:', process.env.PORT); // Should print 4000 if the .env file is loaded correctly

// Start the server
const PORT = process.env.PORT||3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});








