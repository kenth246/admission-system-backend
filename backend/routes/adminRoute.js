const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

module.exports = function(app) {
    app.post('/api/admin/login', adminController.login);
    app.get('/api/admin/applicants', auth, adminController.getAllApplicants);
    app.put('/api/admin/applicant/:id/status', auth, adminController.updateStatus);
    app.post('/api/admin/send-email', auth, adminController.sendEmail);
};