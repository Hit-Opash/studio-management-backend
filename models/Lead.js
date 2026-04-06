const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    eventType: { type: String },
    eventDate: { type: Date },
    budget: { type: Number },
    source: { type: String },
    status: {
        type: String,
        enum: ['New', 'Follow Up', 'Converted', 'Closed'],
        default: 'New'
    },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
