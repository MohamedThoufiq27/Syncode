const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    roomid: { type: String, required: true, unique: true },
    language: { type: String },
    tree: { type: mongoose.Schema.Types.Mixed } // <- store full flexible structure
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Code', codeSchema);
