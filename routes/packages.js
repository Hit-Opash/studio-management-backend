const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

router.get('/', async (req, res) => {
    try {
        const packages = await Package.find().sort({ name: 1 });
        res.json(packages);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/:id', async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) return res.status(404).json({ error: 'Package not found' });
        res.json(pkg);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    try {
        const pkg = new Package(req.body);
        await pkg.save();
        res.status(201).json(pkg);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', async (req, res) => {
    try {
        const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!pkg) return res.status(404).json({ error: 'Package not found' });
        res.json(pkg);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        await Package.findByIdAndDelete(req.params.id);
        res.json({ message: 'Package deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
