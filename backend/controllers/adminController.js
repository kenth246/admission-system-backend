const Applicant = require('../models/applicant');
const Admin = require('../models/admin');
const emailService = require('../utils/emailService');
const jwt = require('jsonwebtoken');

// 1. ADMIN LOGIN
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // Simple check against Admin Model (or hardcoded if you prefer)
        // Assuming Admin Model uses 'username' not 'email', but frontend sends 'email'
        // We will check if the input matches the stored username or a specific admin email
        const admin = await Admin.findOne({ username: email });

        if (!admin || admin.password !== password) {
            // Fallback for testing if no DB admin exists yet
            if (email === "admin@btech.com" && password === "admin123") {
                const token = jwt.sign({ id: "static_admin" }, 'preadmission_key', { expiresIn: '8h' });
                return res.json({ token, msg: "Admin logged in (Static)" });
            }
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: admin._id }, 'preadmission_key', { expiresIn: '8h' });
        res.json({ token, msg: "Admin logged in" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 2. DASHBOARD & APPLICATIONS LIST
// Maps DB data to the structure required by Applications.jsx
exports.getAllApplicants = async(req, res) => {
    try {
        const applicants = await Applicant.find().sort({ createdAt: -1 });

        const formatted = applicants.map(app => {
            // Helper to format date
            const dateStr = new Date(app.createdAt).toLocaleDateString();

            return {
                id: app.username, // Using Username as ID for display
                name: `${app.given_name} ${app.surname}`.toUpperCase(),
                type: (app.requirements && app.requirements.student_type) || "Freshmen",
                location: app.address ?.town_city ? app.address.town_city.toUpperCase() : "N/A",
                date: dateStr,
                status: app.status.admission_status,

                // NESTED PROFILE OBJECT (Required by Frontend)
                profile: {
                    personal: {
                        firstName: app.given_name,
                        middleName: app.middle_name,
                        surname: app.surname,
                        suffix: app.suffix,
                        dob: app.birth_date,
                        pob: app.birth_place,
                        gender: app.gender,
                        civilStatus: app.civil_status,
                        email: app.email,
                        contact: app.contact_number,
                        address: `${app.address.house_no || ''} ${app.address.street || ''} ${app.address.barangay || ''}`
                    },
                    family: {
                        fatherName: app.family.father_name,
                        fatherOcc: app.family.father_occupation,
                        fatherContact: app.family.father_contact,
                        motherName: app.family.mother_name,
                        motherOcc: app.family.mother_occupation,
                        motherContact: app.family.mother_contact,
                        guardianName: app.family.guardian_name,
                        guardianOcc: app.family.guardian_occupation,
                        guardianContact: app.family.guardian_contact,
                        siblings: app.family.siblings,
                        income: app.family.family_income
                    },
                    education: {
                        // Mapping flat DB fields to frontend keys
                        elementary: app.education.elementary_school,
                        elemAddr: app.education.elementary_address,
                        elemType: "Public", // Defaults if missing
                        elemYear: app.education.elementary_year,

                        jhs: app.education.junior_high_school,
                        jhsAddr: app.education.junior_high_address,
                        jhsType: "Public",
                        jhsYear: app.education.junior_high_year,

                        shs: app.education.senior_high_school,
                        shsAddr: app.education.senior_high_address,
                        shsType: "Public",
                        shsYear: app.education.senior_high_year,

                        lrn: app.education.lrn,
                        gwa: app.education.gwa
                    },
                    otherInfo: {
                        is4Ps: false, // Add fields to DB if needed
                        isPWD: false,
                        isIndigenous: false
                    },
                    documents: app.documents.map(doc => ({
                        name: doc,
                        type: "FILE"
                    }))
                }
            };
        });

        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// 3. UPDATE STATUS (Approve/Reject)
exports.updateStatus = async(req, res) => {
    try {
        const { status } = req.body;
        // The frontend sends 'username' as 'id' in the route params
        await Applicant.findOneAndUpdate({ username: req.params.id }, { "status.admission_status": status });
        res.json({ msg: "Status updated" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 4. SEND EMAIL (Chat)
exports.sendEmail = async(req, res) => {
    const { email, subject, message } = req.body;
    console.log(`[Mock Email] To: ${email} | Subject: ${subject} | Msg: ${message}`);
    // In production, connect this to Nodemailer
    res.json({ msg: "Email sent" });
};