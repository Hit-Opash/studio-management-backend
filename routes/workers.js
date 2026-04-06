const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

// GET all workers
router.get('/', async (req, res) => {
    try {
        const { search, role, isActive } = req.query;
        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) query.role = role;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        const workers = await Worker.find(query).sort({ name: 1 });
        res.json(workers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single worker
router.get('/:id', async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);
        if (!worker) return res.status(404).json({ error: 'Worker not found' });
        res.json(worker);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create worker
router.post('/', async (req, res) => {
    try {
        const worker = new Worker(req.body);
        await worker.save();
        res.status(201).json(worker);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update worker
router.put('/:id', async (req, res) => {
    try {
        const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!worker) return res.status(404).json({ error: 'Worker not found' });
        res.json(worker);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE worker
router.delete('/:id', async (req, res) => {
    try {
        await Worker.findByIdAndDelete(req.params.id);
        res.json({ message: 'Worker deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
