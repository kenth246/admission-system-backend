const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    username: { type: String, required: true },
    answers: [{
        question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        selected_choice: { type: String }
    }],

    score: { type: Number, default: 0 },
    date_taken: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', ExamSchema);