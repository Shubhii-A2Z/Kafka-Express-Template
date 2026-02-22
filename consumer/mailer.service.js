const { kafka }=require("../client");

const topics=["order-created"];


async function init(){
    // every consumer belongs to a consumer group
    const consumer=kafka.consumer({groupId: 'order-created'});
    
    await consumer.connect();
    console.log('Consumer connected');

    await consumer.subscribe({
        topics: topics,
        fromBeginning: true
    });

    console.log(`Consumer subscribed to topics: ${topics}`);

    await consumer.run({
        eachMessage: async ({message,partition,topic})=>{
            console.log(`Topic: ${topic}, Partition: ${partition}, Offset: ${message.offset}`);
        }
    });
}

init();