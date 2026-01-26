const questionController = require('../controllers/questionController');

module.exports = function(app) {
    app.post('/api/question/add', questionController.addQuestion);
    app.get('/api/question/category/:cat', questionController.getByCategory);
    app.post('/api/question/bulk', questionController.bulkUpload);
};