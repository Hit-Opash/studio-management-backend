const express = require('express');
const router = express.Router();
const Document = require('../models/Document');

router.get('/', async (req, res) => {
    try {
        const { event, fileType } = req.query;
        let query = {};
        if (event) query.event = event;
        if (fileType) query.fileType = fileType;
        const docs = await Document.find(query).populate('event').sort({ uploadDate: -1 });
        res.json(docs);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    try {
        const doc = new Document(req.body);
        await doc.save();
        res.status(201).json(doc);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: 'Document deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
