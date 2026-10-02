const { Kafka }=require("kafkajs");

const kafka=new Kafka({
    clientId: "kafka-practice",
    brokers: ["localhost:9092"]
});

module.exports={
    kafka
}