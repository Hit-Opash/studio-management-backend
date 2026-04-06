const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Expense = require('../models/Expense');
const EventWorker = require('../models/EventWorker');
const moment = require('moment');

// GET /api/reports?type=revenue|expense|profit|event|worker&startDate=&endDate=
router.get('/', async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate) : moment().startOf('year').toDate();
        const end = endDate ? new Date(endDate) : moment().endOf('year').toDate();

        if (type === 'revenue') {
            const events = await Event.find({ eventDate: { $gte: start, $lte: end } }).sort({ eventDate: 1 });
            const total = events.reduce((s, e) => s + (e.totalAmount || 0), 0);
            const received = events.reduce((s, e) => s + (e.advancePayment || 0), 0);
            const pending = events.reduce((s, e) => s + (e.remainingPayment || 0), 0);

            // Monthly breakdown
            const monthly = {};
            events.forEach(e => {
                const m = moment(e.eventDate).format('MMM YYYY');
                if (!monthly[m]) monthly[m] = { month: m, revenue: 0, count: 0 };
                monthly[m].revenue += e.totalAmount || 0;
                monthly[m].count++;
            });

            return res.json({ total, received, pending, events, monthly: Object.values(monthly) });
        }

        if (type === 'expense') {
            const expenses = await Expense.find({ date: { $gte: start, $lte: end } }).sort({ date: 1 });
            const total = expenses.reduce((s, e) => s + e.amount, 0);

            // Category breakdown
            const byCategory = {};
            expenses.forEach(e => {
                if (!byCategory[e.category]) byCategory[e.category] = { category: e.category, total: 0, count: 0 };
                byCategory[e.category].total += e.amount;
                byCategory[e.category].count++;
            });

            // Monthly breakdown
            const monthly = {};
            expenses.forEach(e => {
                const m = moment(e.date).format('MMM YYYY');
                if (!monthly[m]) monthly[m] = { month: m, expenses: 0 };
                monthly[m].expenses += e.amount;
            });

            return res.json({ total, expenses, byCategory: Object.values(byCategory), monthly: Object.values(monthly) });
        }

        if (type === 'profit') {
            const events = await Event.find({ eventDate: { $gte: start, $lte: end } });
            const expenses = await Expense.find({ date: { $gte: start, $lte: end } });
            const workerPayments = await EventWorker.find({ assignedDate: { $gte: start, $lte: end } });

            const totalRevenue = events.reduce((s, e) => s + (e.totalAmount || 0), 0);
            const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
            const totalWorkerPayments = workerPayments.reduce((s, w) => s + (w.payment || 0), 0);
            const netProfit = totalRevenue - totalExpenses - totalWorkerPayments;

            // Monthly breakdown
            const months = {};
            events.forEach(e => {
                const m = moment(e.eventDate).format('MMM YYYY');
                if (!months[m]) months[m] = { month: m, revenue: 0, expenses: 0, workerPay: 0, profit: 0 };
                months[m].revenue += e.totalAmount || 0;
            });
            expenses.forEach(e => {
                const m = moment(e.date).format('MMM YYYY');
                if (!months[m]) months[m] = { month: m, revenue: 0, expenses: 0, workerPay: 0, profit: 0 };
                months[m].expenses += e.amount;
            });
            Object.values(months).forEach(m => {
                m.profit = m.revenue - m.expenses - m.workerPay;
            });

            return res.json({ totalRevenue, totalExpenses, totalWorkerPayments, netProfit, monthly: Object.values(months) });
        }

        if (type === 'event') {
            const events = await Event.find({ eventDate: { $gte: start, $lte: end } }).sort({ eventDate: 1 });
            const byType = {};
            const byStatus = {};
            events.forEach(e => {
                if (!byType[e.eventType]) byType[e.eventType] = 0;
                byType[e.eventType]++;
                if (!byStatus[e.status]) byStatus[e.status] = 0;
                byStatus[e.status]++;
            });
            return res.json({ total: events.length, events, byType, byStatus });
        }

        if (type === 'worker') {
            const assignments = await EventWorker.find({ assignedDate: { $gte: start, $lte: end } })
                .populate('worker').populate('event');
            const byWorker = {};
            assignments.forEach(a => {
                const wId = a.worker?._id?.toString();
                if (!wId) return;
                if (!byWorker[wId]) {
                    byWorker[wId] = {
                        worker: a.worker,
                        eventCount: 0,
                        totalPayment: 0
                    };
                }
                byWorker[wId].eventCount++;
                byWorker[wId].totalPayment += a.payment || 0;
            });
            return res.json({ assignments, byWorker: Object.values(byWorker) });
        }

        res.status(400).json({ error: 'Invalid report type. Use: revenue, expense, profit, event, worker' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
