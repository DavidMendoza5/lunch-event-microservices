import RabbitMQ from '../connection';

export class IngredientPurchaseProducer {
  private exchange = 'market.direct';
  private routingKey = 'market.response.purchase';

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

    console.log('📢 IngredientPurchase event published:', event);
  }
}
