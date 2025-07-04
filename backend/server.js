require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('../backend/config/database');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));