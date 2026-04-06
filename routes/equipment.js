const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

router.get('/', async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
                { serialNumber: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) query.status = status;
        const equipment = await Equipment.find(query).sort({ name: 1 });
        res.json(equipment);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await Equipment.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Equipment not found' });
        res.json(item);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    try {
        const item = new Equipment(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
    try {
        const item = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ error: 'Equipment not found' });
        res.json(item);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        await Equipment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Equipment deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
