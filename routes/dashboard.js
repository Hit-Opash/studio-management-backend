const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Expense = require('../models/Expense');
const Payment = require('../models/Payment');
const moment = require('moment');

// GET /api/dashboard
router.get('/', async (req, res) => {
    try {
        const today = moment().startOf('day').toDate();
        const tomorrow = moment().add(1, 'day').startOf('day').toDate();
        const dayAfterTomorrow = moment().add(2, 'days').startOf('day').toDate();
        const monthStart = moment().startOf('month').toDate();
        const monthEnd = moment().endOf('month').toDate();

        // Event counts
        const totalEvents = await Event.countDocuments();
        const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });
        const todaysEvents = await Event.countDocuments({
            eventDate: { $gte: today, $lt: tomorrow }
        });
        const completedEvents = await Event.countDocuments({ status: 'Completed' });

        // Financial stats
        const allEvents = await Event.find();
        const monthlyEvents = await Event.find({
            eventDate: { $gte: monthStart, $lte: monthEnd }
        });

        const totalRevenue = allEvents.reduce((sum, e) => sum + (e.totalAmount || 0), 0);
        const monthlyRevenue = monthlyEvents.reduce((sum, e) => sum + (e.totalAmount || 0), 0);
        const totalReceived = allEvents.reduce((sum, e) => sum + (e.advancePayment || 0), 0);
        const pendingPayments = allEvents
            .filter(e => e.paymentStatus !== 'Paid')
            .reduce((sum, e) => sum + (e.remainingPayment || 0), 0);

        // Expenses
        const allExpenses = await Expense.find();
        const totalExpenses = allExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        const monthlyExpenses = allExpenses
            .filter(e => moment(e.date).isBetween(monthStart, monthEnd, null, '[]'))
            .reduce((sum, e) => sum + (e.amount || 0), 0);

        const netProfit = totalReceived - totalExpenses;

        // Today's and tomorrow's events
        const todayEventsList = await Event.find({
            eventDate: { $gte: today, $lt: tomorrow }
        }).sort({ eventTime: 1 }).limit(10);

        const tomorrowEventsList = await Event.find({
            eventDate: { $gte: tomorrow, $lt: dayAfterTomorrow }
        }).sort({ eventTime: 1 }).limit(10);

        // Recent bookings & expenses
        const recentBookings = await Event.find().sort({ createdAt: -1 }).limit(5);
        const recentExpenses = await Expense.find().sort({ createdAt: -1 }).limit(5);

        // Monthly chart data (last 6 months)
        const chartData = [];
        for (let i = 5; i >= 0; i--) {
            const mStart = moment().subtract(i, 'months').startOf('month').toDate();
            const mEnd = moment().subtract(i, 'months').endOf('month').toDate();
            const label = moment().subtract(i, 'months').format('MMM YYYY');

            const mEvents = await Event.find({ eventDate: { $gte: mStart, $lte: mEnd } });
            const mExpenses = await Expense.find({ date: { $gte: mStart, $lte: mEnd } });

            const revenue = mEvents.reduce((s, e) => s + (e.totalAmount || 0), 0);
            const expenses = mExpenses.reduce((s, e) => s + (e.amount || 0), 0);

            chartData.push({
                month: label,
                revenue,
                expenses,
                profit: revenue - expenses
            });
        }

        res.json({
            stats: {
                totalEvents,
                upcomingEvents,
                todaysEvents,
                completedEvents,
                totalRevenue,
                monthlyRevenue,
                totalExpenses,
                monthlyExpenses,
                netProfit,
                pendingPayments,
                totalReceived
            },
            todayEvents: todayEventsList,
            tomorrowEvents: tomorrowEventsList,
            recentBookings,
            recentExpenses,
            chartData
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
