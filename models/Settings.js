const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    companyName: { type: String, default: 'My Photography Studio' },
    companyLogo: { type: String },
    businessPhone: { type: String },
    businessEmail: { type: String },
    address: { type: String },
    currency: { type: String, default: 'INR' },
    currencySymbol: { type: String, default: '₹' },
    defaultEventTypes: {
        type: [String],
        default: ['Wedding', 'Pre-Wedding', 'Birthday', 'Corporate', 'Engagement', 'Baby Shower', 'Portrait', 'Product', 'Fashion', 'Other']
    },
    defaultExpenseCategories: {
        type: [String],
        default: ['Equipment', 'Travel', 'Food', 'Salary', 'Rent', 'Marketing', 'Other']
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
