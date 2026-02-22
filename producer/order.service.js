const express = require('express');
const { StatusCodes } = require('http-status-codes');
const { kafka } = require('../client');

const PORT=process.env.PORT || 3000;
const app=express();
app.use(express.json());

const producer=kafka.producer();

class OrderService{
    async createOrder(orderData){
        try {
            const key = orderData.userEmail || Date.now().toString();
            console.log('Sending order-created event');

            await producer.send({
                topic: 'order-created',
                messages: [
                    {
                        key: key, // partition = hash(key) % number_of_partitions
                        value: JSON.stringify({
                            orderData: orderData,
                            timeStamp: new Date().toISOString()
                        }),
                    },
                ],
            });

            return { success: true,orderId: key};
        } catch (error) {
            console.error('Order creation error:',error);
            throw error;
        }
    }

    async updateUser(userEmail, orderId){
        try {
            await producer.send({
                topic: 'order-updated',
                messages: [
                    {
                        key: userEmail,
                        value: JSON.stringify({
                            orderId,
                            userEmail,
                            timeStamp: new Date().toISOString()
                        }),
                    },
                ],
            });
            return {success:true};
        } catch (error) {
            console.error('Order update error:', error);
            throw error;
        }
    }
}

const orderService=new OrderService();

app.post('/api/v1/orders', async (req, resp)=>{
    try {
        const order=await orderService.createOrder(req.body);

        if(req.body.sendUserUpdate) {
            await orderService.updateUser(req.body.userEmail, order.orderId);
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
});


async function startServer(){
    try {
        await producer.connect();
        console.log('Connected to Kafka successfully');
        
        app.listen(PORT,()=>{
            console.log(`Server started at port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to Kafka:', err);
    }
}

startServer();

process.on('SIGINT', async ()=>{
    await producer.disconnect();
    console.log('Order service disconnected');
    process.exit(0);
});