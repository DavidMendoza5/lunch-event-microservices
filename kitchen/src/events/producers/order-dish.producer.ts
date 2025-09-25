import RabbitMQ from '../connection';

export class OrderDishProducer {
  private exchange = 'warehouse.ingredients';

  async publish(event: object) {
    const rabbit = await RabbitMQ.getInstance();
    const channel = rabbit.getChannel();

    await channel.assertExchange(this.exchange, 'fanout', { durable: true });
    channel.publish(this.exchange, '', Buffer.from(JSON.stringify(event)), {
      persistent: true,
    });

    console.log('📢 Ingredient event published:', event);
  }
}
