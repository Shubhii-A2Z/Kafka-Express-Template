const OrderPublisher = require("./publishers/order.publisher");
// Import additional publishers as your app grows:
// const paymentPublisher = require('./publishers/payment.publisher');
// const userPublisher = require('./publishers/user.publisher');


/**
 * Connects all Kafka producers
 */
async function connectAllPublishers() {
    console.log('Connecting all Kafka publishers...');
    await new OrderPublisher().connect();
    console.log('All Kafka publishers connected successfully.');
}

module.exports = {
    connectAllPublishers
};