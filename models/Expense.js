const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    category: {
        type: String,
        enum: ['Equipment', 'Travel', 'Food', 'Salary', 'Rent', 'Marketing', 'Other'],
        default: 'Other'
    },
    date: { type: Date, default: Date.now },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
