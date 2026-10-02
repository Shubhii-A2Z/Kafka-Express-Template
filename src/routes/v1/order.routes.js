const express = require('express');
const OrderController = require('../../controllers/order.controller');

const orderRouter = express.Router()

const orderController=new OrderController();

// SYSTEM DESIGN TIP: Mount middleware here (Authentication, Rate Limiting, Request Validation Schema)
orderRouter.post('/', orderController.createOrder);

module.exports = orderRouter;