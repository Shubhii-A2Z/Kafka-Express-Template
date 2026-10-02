const { StatusCodes } = require('http-status-codes');
const OrderService = require('../services/order.service');

class OrderController {

    orderService;

    constructor(){
        this.orderService=new OrderService()
    }

    createOrder=async (req, resp)=> {
        try {
            // All business rules, validation logic, and state changes belong in the Service layer.
            const order = await this.orderService.createOrder(req.body);

            if (req.body.sendUserUpdate) {
                await this.orderService.updateUser(req.body.userEmail, order.orderId);
            }

            return resp.status(StatusCodes.CREATED).json({
                Order: order
            });
        } catch (error) {
            console.error(error);
            return resp.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: 'Order Creation failed',
            });
        }
    }

}

module.exports = OrderController;