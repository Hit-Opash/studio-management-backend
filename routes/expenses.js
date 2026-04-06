const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// GET all expenses with filters
router.get('/', async (req, res) => {
    try {
        const { search, category, startDate, endDate } = req.query;
        let query = {};
        if (search) { query.title = { $regex: search, $options: 'i' }; }
        if (category) query.category = category;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        const expenses = await Expense.find(query).sort({ date: -1 });
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);
        res.json({ expenses, total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single expense
router.get('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ error: 'Expense not found' });
        res.json(expense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create expense
router.post('/', async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save();
        res.status(201).json(expense);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update expense
router.put('/:id', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!expense) return res.status(404).json({ error: 'Expense not found' });
        res.json(expense);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE expense
router.delete('/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: 'Expense deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
