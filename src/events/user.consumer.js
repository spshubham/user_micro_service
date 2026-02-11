const amqp = require("amqplib");

async function consume() {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();

  await channel.assertQueue("user.created");

  channel.consume("user.created", (msg) => {
    const data = JSON.parse(msg.content.toString());

    console.log("📩 User Created Event:", data);

    channel.ack(msg);
  });
}

consume();
