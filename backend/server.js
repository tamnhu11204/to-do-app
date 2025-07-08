require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

routes(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));