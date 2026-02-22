const {Kafka}=require('kafkajs');

// Topics to create
const topicsToCreate=[
    {
        name: "order-created",
        partitions: 3,
        replicationFactor: 1
    },
    {
        name: "order-updated",
        partitions: 1,
        replicationFactor: 1
    }
];

const kafka=new Kafka({
    clientId: "init",
    brokers: ["localhost:9092"]
});

async function init() {
    // Creating the admin instance
    const admin=kafka.admin();

    try {
        await admin.connect();
        console.log('Kafka admin connected');

        const topics=await admin.listTopics();
        console.log(`Existing topics: ${topics}`);

        const created=await admin.createTopics({
            topics: topicsToCreate.map((topic)=>({
                topic: topic.name,
                numPartitions: topic.partitions || 3,
                replicationFactor: topic.replicationFactor
            })),
        });

        console.log({created});
    } 
    catch (error) {
        console.log('Kafka initialization error');
    }
    finally {
        await admin.disconnect();
        console.log('Kafka admin disconnected');
    }
}

init();