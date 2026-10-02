const express = require('express');
const apiRouter = require('./routes');

const app = express();
app.use(express.json());

// API route routing
app.use('/api', apiRouter);

module.exports = app;