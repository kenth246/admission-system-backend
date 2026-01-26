const assessmentController = require('../controllers/assessmentController');

module.exports = function(app) {
    app.post('/api/assessment/exam-submit', assessmentController.submitExam);
    app.post('/api/assessment/interview-save', assessmentController.saveInterview);
};