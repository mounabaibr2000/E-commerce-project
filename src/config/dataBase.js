
const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/Ashion");
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
    }
}

module.exports = connectDB;

