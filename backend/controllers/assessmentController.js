const Exam = require('../models/exam');
const Question = require('../models/question');
const Interview = require('../models/interview');
const Applicant = require('../models/applicant');

exports.submitExam = async(req, res) => {
    try {
        const { username, answers } = req.body;
        let score = 0;

        for (let attempt of answers) {
            const question = await Question.findById(attempt.question_id);
            if (question && question.correct_answer === attempt.selected_choice) {
                score++;
            }
        }

        const examData = new Exam({ username, score, total_questions: answers.length, answers });
        await examData.save();
        res.status(201).json({ message: "BCeT Result Saved", score, data: examData });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.saveInterview = async(req, res) => {
    try {
        const { username, responses } = req.body;

        const formattedResponses = responses.map((ans, index) => ({
            question: `Question ${index + 1}`,
            answer: ans
        }));

        const newInterview = new Interview({
            username,
            responses: formattedResponses,
            status: "Pending"
        });

        await newInterview.save();

        await Applicant.findOneAndUpdate({ username }, { "status.admission_status": "Pending" });

        res.json({ msg: "Interview saved" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};