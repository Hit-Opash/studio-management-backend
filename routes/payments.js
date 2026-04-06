const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Event = require('../models/Event');

// GET all payments
router.get('/', async (req, res) => {
    try {
        const { event, startDate, endDate } = req.query;
        let query = {};
        if (event) query.event = event;
        if (startDate || endDate) {
            query.paymentDate = {};
            if (startDate) query.paymentDate.$gte = new Date(startDate);
            if (endDate) query.paymentDate.$lte = new Date(endDate);
        }
        const payments = await Payment.find(query).populate('event').sort({ paymentDate: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create payment — also updates the event's advancePayment
router.post('/', async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();

        // Update event advance payment
        if (payment.event) {
            const event = await Event.findById(payment.event);
            if (event) {
                event.advancePayment = (event.advancePayment || 0) + payment.amount;
                await event.save();
            }
        }

        const populated = await Payment.findById(payment._id).populate('event');
        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE payment
router.delete('/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ error: 'Payment not found' });

        // Reverse the advance payment on the event
        if (payment.event) {
            const event = await Event.findById(payment.event);
            if (event) {
                event.advancePayment = Math.max(0, (event.advancePayment || 0) - payment.amount);
                await event.save();
            }
        }

        await Payment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Payment deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
