const Applicant = require('../models/applicant');
const bcrypt = require('bcryptjs');

// 1. REGISTER
exports.register = async(req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // FIX: Check if Username OR Email already exists
        // We use $or to check both fields at once
        let user = await Applicant.findOne({
            $or: [{ username: username }, { email_address: email }]
        });

        if (user) {
            return res.status(400).json({
                success: false,
                message: 'Username or Email already exists'
            });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new applicant
        const newApplicant = new Applicant({
            ...req.body,
            username: username,
            email_address: email, // Ensure email matches schema field
            password: hashedPassword,
            status: { admission_status: "Incomplete" }
        });

        // Auto Prio Location logic
        if (address && address.town_city && address.town_city.toLowerCase() === 'baliwag' && address.province && address.province.toLowerCase() === 'bulacan') {
            newApplicant.status = newApplicant.status || {};
            newApplicant.status.priority_level = newApplicant.status.priority_level || {};
            newApplicant.status.priority_level.area_rank = "Baliwag";
        }

        await newApplicant.save();
        res.status(201).json({ success: true, data: newApplicant });

    } catch (error) {
        console.error("Register Error:", error); // Log exact error to console
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. LOGIN
exports.login = async(req, res) => {
    try {
        const { username, password } = req.body;

        // Check User by username
        const user = await Applicant.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        // Return Success with username
        res.json({ msg: 'Login success', username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// 3. UPDATE PROFILE
exports.updateProfile = async(req, res) => {
    try {
        const { id } = req.params; // This is the username passed in URL
        const updateData = req.body;

        const applicant = await Applicant.findOneAndUpdate({ username: id }, { $set: updateData }, { new: true });

        res.json(applicant);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 4. GET ALL
exports.getAll = async(req, res) => {
    try {
        const applicants = await Applicant.find();
        res.status(200).json(applicants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. GET BY ID (Username)
exports.getById = async(req, res) => {
    try {
        const student = await Applicant.findOne({ username: req.params.id });
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; // 6. [ADDED] GET BY LRN
exports.getByLrn = async(req, res) => {
    try {
        // Find student where education.lrn matches the URL parameter
        const student = await Applicant.findOne({ "education.lrn": req.params.lrn });

        if (!student) return res.status(404).json({ message: "Student not found with this LRN" });
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};