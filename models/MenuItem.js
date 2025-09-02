const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['appetizer', 'main course', 'dessert', 'beverage', 'side dish']
    },
    ingredients: [{
        type: String,
        required: true
    }],
    available: {
        type: Boolean,
        default: true
    },
    preparationTime: {
        type: Number, // in minutes
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);