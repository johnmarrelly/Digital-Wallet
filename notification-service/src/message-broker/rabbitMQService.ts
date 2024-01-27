import * as amqp from "amqplib";

export default class RabbitMQService {
  connection: amqp.Connection;
  channel: any;
  config: { connectionURL: string };

  constructor(config: { connectionURL: string }) {
    this.config = config;
  }

  async connect() {
    this.connection = await amqp.connect(this.config.connectionURL);
    this.channel = await this.connection.createChannel();
  }

  async publish(queue: string, message: any) {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  }

  async subscribe(queue: string, callback: (args: any) => void) {
    await this.channel.assertQueue(queue, { durable: true });

    return new Promise<void>((resolve) => {
      this.channel.consume(queue, (msg: any) => {
        if (msg) {
          const message = JSON.parse(msg.content.toString());
          callback(message);
          this.channel.ack(msg);
        }
        resolve();
      });
    });
  }

  async close() {
    if (this.connection) {
      await this.connection.close();
    }
  }
}
