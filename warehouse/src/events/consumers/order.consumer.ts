import IOrderRecipeIngredientModel from '@/models/interfaces/order-recipe-ingredient.interface';
import RabbitMQ from '../connection';
import OrderRecipeIngredientModel from '@/models/order-recipe-ingredient.model';

export class OrderConsumer {
  private exchange = 'orders.direct';
  private queue = 'kitchen_orders_queue';
  private routingKey = 'order.created';

  async consume() {
    const rabbit = await RabbitMQ.getInstance();
    const channel = rabbit.getChannel();

    await channel.assertExchange(this.exchange, 'direct', { durable: true });

    const q = await channel.assertQueue(this.queue, { durable: true });

    await channel.bindQueue(q.queue, this.exchange, this.routingKey);

    channel.prefetch(5);

    channel.consume(q.queue, async (msg) => {
      if (!msg) return;

      try {
        const orders: IOrderRecipeIngredientModel[] = JSON.parse(
          msg.content.toString(),
        );
        console.log('🍽️ Warehouse received orders:', orders);

        await OrderRecipeIngredientModel.bulkCreate(orders);

        channel.ack(msg);
      } catch (err) {
        console.error('❌ Error processing order message:', err);
        channel.nack(msg, false, true);
      }
    });

    console.log(`✅ Warehouse is listening for orders...`);
  }
}
