const amqp = require("amqplib");

let channel;

async function connectMQ() {
  try {
    const conn = await amqp.connect(
      process.env.RABBIT_URL || "amqp://localhost"
    );

    channel = await conn.createChannel();

    await channel.assertQueue("user.created");

    console.log("RabbitMQ Connected ✅");
  } catch (err) {
    console.error("RabbitMQ Connection Failed ❌", err);
  }
}

function publishEvent(data) {
  if (!channel) return;

  channel.sendToQueue(
    "user.created",
    Buffer.from(JSON.stringify(data))
  );
}

module.exports = { connectMQ, publishEvent };
