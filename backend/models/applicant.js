const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
    // Log-in
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    surname: { type: String, default: "" },
    given_name: { type: String, default: "" },
    middle_name: { type: String, default: "" },
    suffix: { type: String, default: "" },
    gender: { type: String, default: "" },
    birth_date: { type: String, default: "" },
    birth_place: { type: String, default: "" },
    religion: { type: String, default: "" },
    civil_status: { type: String, default: "Single" },
    contact_number: { type: String, default: "" },

    address: {
        house_no: { type: String, default: "" },
        street: { type: String, default: "" },
        barangay: { type: String, default: "" },
        town_city: { type: String, default: "" },
        province: { type: String, default: "" },
        zip_code: { type: String, default: "" },
        region: { type: String, default: "" }
    },

    family: {
        father_name: { type: String, default: "" },
        father_occupation: { type: String, default: "" },
        father_contact: { type: String, default: "" },
        mother_name: { type: String, default: "" },
        mother_occupation: { type: String, default: "" },
        mother_contact: { type: String, default: "" },
        guardian_name: { type: String, default: "" },
        guardian_occupation: { type: String, default: "" },
        guardian_contact: { type: String, default: "" },
        siblings: { type: Number, default: 0 },
        family_income: { type: String, default: "" }
    },

    education: {
        lrn: { type: String, default: "" },
        gwa: { type: String, default: "" },
        elementary_school: { type: String, default: "" },
        elementary_address: { type: String, default: "" },
        elementary_year: { type: String, default: "" },
        junior_high_school: { type: String, default: "" },
        junior_high_address: { type: String, default: "" },
        junior_high_year: { type: String, default: "" },
        senior_high_school: { type: String, default: "" },
        senior_high_address: { type: String, default: "" },
        senior_high_year: { type: String, default: "" },
        college_school: { type: String, default: "" },
        college_address: { type: String, default: "" },
        college_year: { type: String, default: "" }
    },

    documents: [String],

    status: {
        admission_status: {
            type: String,
            enum: ['Incomplete', 'Pending', 'Qualified', 'Evaluated', 'Admitted', 'Rejected'],
            default: 'Incomplete'
        },
        priority_level: {
            area_rank: { type: String, default: "" },
            school_priority_remark: { type: String, default: "" }
        },
        interview_grade: { type: String, default: "" },
        exam_status: { type: String, default: "Pending" },
        interview_status: { type: String, default: "Pending" }
    }
}, { timestamps: true });

module.exports = mongoose.model('Applicant', ApplicantSchema);