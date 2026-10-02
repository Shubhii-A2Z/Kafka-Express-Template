const OrderPublisher = require("../events/publishers/order.publisher");

class OrderService {

    orderPublisher;

    constructor(){
        this.orderPublisher=new OrderPublisher();
    }

    createOrder=async (orderData)=>{
        try {
            // 1. Perform Input Validation (e.g., check stock, validate user session)
            // 2. Open Database Transaction:
            //    const session = await mongoose.startSession(); / const trx = await knex.transaction();
            // 3. Save Order record in Database:
            //    const newOrder = await OrderModel.create([orderData], { session });
            const key = await this.orderPublisher.publishOrderCreated(orderData);
            return { success: true, orderId: key };
        } catch (error) {
            console.error('Order creation error:', error);
            throw error;
        }
    }

    updateUser=async (userEmail, orderId)=> {
        try {
            // 1. Fetch user record from Database:
            //    const user = await UserModel.findByEmail(userEmail);
            // 2. Update user status or order counts in DB:
            //    await UserModel.updateOne({ email: userEmail }, { $inc: { orderCount: 1 } });
            await this.orderPublisher.publishUserUpdated(userEmail, orderId);
            return { success: true };
        } catch (error) {
            console.error('Order update error:', error);
            throw error;
        }
    }

}

module.exports = OrderService;