const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    fileName: { type: String, required: true },
    fileType: {
        type: String,
        enum: ['Contract', 'Invoice', 'Client Document', 'Event Schedule', 'Other'],
        default: 'Other'
    },
    filePath: { type: String },
    uploadDate: { type: Date, default: Date.now },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
