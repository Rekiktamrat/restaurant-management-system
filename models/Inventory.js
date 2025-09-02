const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['vegetable', 'meat', 'dairy', 'beverage', 'spice', 'grain', 'other']
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'g', 'l', 'ml', 'piece', 'pack']
    },
    minStockLevel: {
        type: Number,
        required: true,
        min: 0
    },
    costPerUnit: {
        type: Number,
        required: true,
        min: 0
    },
    supplier: {
        type: String,
        required: true
    },
    lastRestocked: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);