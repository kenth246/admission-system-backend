const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

require('./routes/applicantRoute')(app);
require('./routes/adminRoute')(app);
require('./routes/assessmentRoute')(app);
// require('./routes/questionRoute')(app);

app.get('/', (req, res) => res.send('Admission System API is running...'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(() => process.exit(1));