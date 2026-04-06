const express = require('express');
const router = express.Router();
const EventWorker = require('../models/EventWorker');

// GET all assignments (optionally filter by event or worker)
router.get('/', async (req, res) => {
    try {
        const { event, worker } = req.query;
        let query = {};
        if (event) query.event = event;
        if (worker) query.worker = worker;
        const assignments = await EventWorker.find(query)
            .populate('event')
            .populate('worker')
            .sort({ assignedDate: -1 });
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create assignment
router.post('/', async (req, res) => {
    try {
        const assignment = new EventWorker(req.body);
        await assignment.save();
        const populated = await EventWorker.findById(assignment._id).populate('event').populate('worker');
        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update assignment
router.put('/:id', async (req, res) => {
    try {
        const assignment = await EventWorker.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('event').populate('worker');
        if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
        res.json(assignment);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE assignment
router.delete('/:id', async (req, res) => {
    try {
        await EventWorker.findByIdAndDelete(req.params.id);
        res.json({ message: 'Assignment removed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
