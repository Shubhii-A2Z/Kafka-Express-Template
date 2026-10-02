const express = require('express');
const orderRouter = require('./order.routes');

const v1Router = express.Router()

v1Router.use('/orders', orderRouter);

module.exports = v1Router;