const applicantController = require('../controllers/applicantController');

module.exports = function(app) {
    app.post('/api/applicant/register', applicantController.register);
    app.post('/api/applicant/login', applicantController.login);
    app.put('/api/applicant/update/:id', applicantController.updateProfile);
    app.get('/api/applicant/:id', applicantController.getById);
};