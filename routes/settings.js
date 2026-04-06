const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// GET settings (singleton)
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
            await settings.save();
        }
        res.json(settings);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update settings
router.put('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(req.body);
        } else {
            Object.assign(settings, req.body);
        }
        await settings.save();
        res.json(settings);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

module.exports = router;
