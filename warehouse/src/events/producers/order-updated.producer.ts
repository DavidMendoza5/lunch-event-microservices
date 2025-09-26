import RabbitMQ from '../connection';

export class OrderUpdatedProducer {
  private exchange = 'orders.direct';
  private routingKey = 'order.updated';

  async publish(event: object) {
    const rabbit = await RabbitMQ.getInstance();
    const channel = rabbit.getChannel();

    await channel.assertExchange(this.exchange, 'direct', { durable: true });
    channel.publish(
      this.exchange,
      this.routingKey,
      Buffer.from(JSON.stringify(event)),
      { persistent: true },
    );

    console.log('📢 OrderUpdated event published:', event);
  }
}
