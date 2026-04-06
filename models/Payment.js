const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Bank Transfer', 'UPI', 'Card', 'Cheque', 'Other'],
        default: 'Cash'
    },
    paymentDate: { type: Date, default: Date.now },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
