import amqp, { Channel } from 'amqplib';

class RabbitMQ {
  private static instance: RabbitMQ;
  private connection!: any;
  private channel!: Channel;

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

    console.log('✅ RabbitMQ conectado');
  }

  public getChannel(): Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ channel no inicializado');
    }
    return this.channel;
  }

  public async close() {
    await this.channel?.close();
    await this.connection?.close();
  }
}

export default RabbitMQ;
