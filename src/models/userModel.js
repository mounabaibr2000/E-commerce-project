const mongoose = require('mongoose');
const validator = require('validator'); // For email validation
const bcrypt = require('bcryptjs'); // For password hashing

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    validate: {
      validator: function(v) {
        // Simple validation for mobile number (e.g., 10-digit numbers)
        return /^(?:\+?\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(v);
      },
      message: 'Invalid mobile number format'
    },
  },
  username: {
    type: String,
    unique: true,
    required: true,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid email format']
  },
  password: {
    type: String,
    required: true,
    minlength: [4, 'Password must be at least 4 characters long'],
    validate: {
      validator: function(v) {
        // Regular expression to check for at least one uppercase letter, one special character
        return /^(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(v);
      },
      message: 'Password must contain at least one uppercase letter and one special character'
    }
  },
  role: {
    type: String,
    default: 'customer'
  },
  dob: {
    type: Date,
    validate: {
      validator: function(v) {
        // Ensure date of birth is not a future date
        return v < Date.now();
      },
      message: 'Date of birth cannot be a future date'
    }
  },
  address: {
    type: String
  },
});

// Pre-save hook to hash password before saving the user document
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Only hash the password if it's been modified

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (err) {
    next(err);
  }
});
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};




module.exports = mongoose.model('User', userSchema);
