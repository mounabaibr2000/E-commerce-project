const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    brandName:{
        type:String,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
       
        min: 0
    },
    images: {
        type: [String],
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'A product must have at least one image.'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to update `updatedAt` field
productSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Product", productSchema);
