import amqp from 'amqplib';

class RabbitMQ {
  private static instance: RabbitMQ;
  private connection!: any;
  private channel!: amqp.Channel;

  private constructor() {}

  public static async getInstance(): Promise<RabbitMQ> {
    if (!RabbitMQ.instance) {
      RabbitMQ.instance = new RabbitMQ();
      await RabbitMQ.instance.connect();
    }
    return RabbitMQ.instance;
  }

  private async connect() {
    this.connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://localhost',
    );
    this.channel = await this.connection.createChannel();

    console.log('✅ RabbitMQ connected');
  }

  public getChannel(): amqp.Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }
    return this.channel;
  }

  public async close() {
    await this.channel?.close();
    await this.connection?.close();
  }
}

export default RabbitMQ;
