const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    category: { type: String, default: 'IT' },
    question_text: { type: String, required: true },

    options: {
        A: { type: String, required: true },
        B: { type: String, required: true },
        C: { type: String, required: true },
        D: { type: String, required: true }
    },

    correct_answer: { type: String, required: true }
});

module.exports = mongoose.model('Question', QuestionSchema);