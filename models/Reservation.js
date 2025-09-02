const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerPhone: {
        type: String,
        required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    reservationDate: {
        type: Date,
        required: true
    },
    reservationTime: {
        type: String,
        required: true
    },
    partySize: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['confirmed', 'seated', 'completed', 'cancelled', 'no-show'],
        default: 'confirmed'
    },
    specialRequests: {
        type: String,
        default: ''
    },
    duration: {
        type: Number, // in minutes
        default: 120
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);