const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
    username: { type: String, required: true },
    responses: [{
        question: { type: String },
        answer: { type: String }
    }],

    score: { type: Number, default: 0 },
    remarks: { type: String, default: "" },
    status: { type: String, default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model('Interview', InterviewSchema);