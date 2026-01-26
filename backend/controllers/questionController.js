const Question = require('../models/question');

exports.addQuestion = async(req, res) => {
    try {
        const newQuestion = new Question(req.body);
        await newQuestion.save();
        res.status(201).json({ success: true, data: newQuestion });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getByCategory = async(req, res) => {
    try {
        const questions = await Question.find({ category: req.params.cat });
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.bulkUpload = async(req, res) => {
    try {
        const questions = await Question.insertMany(req.body.questions);
        res.status(201).json({ success: true, count: questions.length });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateQuestion = async(req, res) => {
    try {
        const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteQuestion = async(req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Question removed" });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};