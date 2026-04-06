const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    role: {
        type: String,
        enum: ['Photographer', 'Videographer', 'Assistant', 'Editor'],
        required: true
    },
    salaryType: {
        type: String,
        enum: ['Monthly', 'Per Event', 'Per Day'],
        default: 'Per Event'
    },
    salaryAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);
