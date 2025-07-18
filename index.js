// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import cors from 'cors';
// import connectToMongoDB from './config/connectDatabase.js';
require('dotenv').config();
const express = require('express');
const cors = require('cors')
const app = express();
const connectToMongoDB = require('./config/connectDatabase')
app.use(cors());
app.use(express.json());
connectToMongoDB();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/staff', require('./routes/user.routes'));
app.use('/api/students', require('./routes/student.routes'));
app.use('/api/permissions', require('./routes/permission.routes'));

app.get('/', (req, res) => {
  res.send('<h1>Server Running</h1>');
});
