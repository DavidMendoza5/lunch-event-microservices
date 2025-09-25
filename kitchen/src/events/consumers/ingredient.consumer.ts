import IngredientModel from '@/models/ingredient.model';
import RabbitMQ from '../connection';

export class IngredientConsumer {
  private exchange = 'warehouse.ingredients';
  private queue = 'kitchen_ingredients_queue';

  async consume() {
    const rabbit = await RabbitMQ.getInstance();
    const channel = rabbit.getChannel();

    await channel.assertExchange(this.exchange, 'fanout', { durable: true });
    const q = await channel.assertQueue(this.queue, { durable: true });
    await channel.bindQueue(q.queue, this.exchange, '');

    channel.consume(q.queue, async (msg) => {
      if (msg) {
        const event = JSON.parse(msg.content.toString());
        console.log('🍽️ Kitchen received ingredient event:', event);

        await IngredientModel.bulkCreate([event.data]);

        channel.ack(msg);
      }
    });

    console.log('✅ Kitchen is listening for ingredient events...');
  }
}
