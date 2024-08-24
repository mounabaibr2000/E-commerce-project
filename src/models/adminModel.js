
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Define the schema for Admin
const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: props => `${props.value} is not a valid email address!`
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: (value) => validator.isMobilePhone(value, 'any', { strictMode: false }),
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum length for password
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


// Create a model from the schema
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
