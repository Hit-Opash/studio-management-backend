const mongoose = require('mongoose');

const eventWorkerSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    role: { type: String },
    assignedDate: { type: Date, default: Date.now },
    payment: { type: Number, default: 0 },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('EventWorker', eventWorkerSchema);
