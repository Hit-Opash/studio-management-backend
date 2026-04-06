const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String },
    model: { type: String },
    serialNumber: { type: String },
    purchaseDate: { type: Date },
    purchasePrice: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Available', 'In Use', 'Under Repair'],
        default: 'Available'
    },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);
