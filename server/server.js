const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./src/routers/user-router.js'); // Import the router

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();

app.use('/api/user', userRouter);

mongoose.connect( process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});