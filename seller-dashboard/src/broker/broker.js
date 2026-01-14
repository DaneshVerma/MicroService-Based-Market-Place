const amqplib = require('amqplib');


let channel, connection;


async function connect() {

    if (connection) return connection;

    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        console.log("connect to rabbitMQ");
        channel = await connection.createChannel();
    }
    catch (error) {
        console.error("Failed to connect to RabbitMQ", error);
    }
}

async function publishToQueue(queueName, data) {
    if (!channel || !connection) {
        await connect();
    }

    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    console.log("Message sent to queue:", queueName, data);

}

async function subscribeToQueue(queueName, callback) {
    if (!channel || !connection) {
        await connect();
    }
    await channel.assertQueue(queueName, { durable: true });

    channel.consume(queueName, (msg) => {
        if (msg !== null) {
            const data = JSON.parse(msg.content.toString());
            callback(data);
            channel.ack(msg);
        }
    });
    console.log("Subscribed to queue:", queueName);
}


module.exports = {
    connect,
    publishToQueue,
    subscribeToQueue,
    channel,
    connection
}