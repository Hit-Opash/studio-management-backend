const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET all events with filters
router.get('/', async (req, res) => {
    try {
        const { search, status, eventType, paymentStatus, startDate, endDate } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { clientName: { $regex: search, $options: 'i' } },
                { clientPhone: { $regex: search, $options: 'i' } },
                { venueName: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) query.status = status;
        if (eventType) query.eventType = eventType;
        if (paymentStatus) query.paymentStatus = paymentStatus;
        if (startDate || endDate) {
            query.eventDate = {};
            if (startDate) query.eventDate.$gte = new Date(startDate);
            if (endDate) query.eventDate.$lte = new Date(endDate);
        }

        const events = await Event.find(query).sort({ eventDate: -1 }).populate('packageId');
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('packageId');
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create event
router.post('/', async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update event
router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        Object.assign(event, req.body);
        await event.save();
        res.json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE event
router.delete('/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
