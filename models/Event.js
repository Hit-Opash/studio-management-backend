const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    // Client Information
    clientName: { type: String, required: true },
    clientPhone: { type: String },
    clientEmail: { type: String },
    clientAddress: { type: String },

    // Event Information
    eventType: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventTime: { type: String },
    eventDuration: { type: String },
    venueName: { type: String },
    venueAddress: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    eventNotes: { type: String },

    // Financial Details
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    packagePrice: { type: Number, default: 0 },
    extraCharges: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    advancePayment: { type: Number, default: 0 },
    remainingPayment: { type: Number, default: 0 },

    // Status
    status: {
        type: String,
        enum: ['Upcoming', 'Completed', 'Cancelled'],
        default: 'Upcoming'
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Partial', 'Pending'],
        default: 'Pending'
    }
}, { timestamps: true });

// Auto-calc totalAmount and remainingPayment
eventSchema.pre('save', function (next) {
    this.totalAmount = (this.packagePrice + this.extraCharges) - this.discount;
    this.remainingPayment = this.totalAmount - this.advancePayment;
    if (this.remainingPayment <= 0) {
        this.paymentStatus = 'Paid';
        this.remainingPayment = 0;
    } else if (this.advancePayment > 0) {
        this.paymentStatus = 'Partial';
    } else {
        this.paymentStatus = 'Pending';
    }
    next();
});

module.exports = mongoose.model('Event', eventSchema);
