import RabbitMQ from '../connection';
import OrderDishModel from '@/models/order-dishes.model';
import OrderModel from '@/models/order.model';
import { STATUS_ENUM } from '@/types/enums/order-status.enum';
import UnitOfWork from '@utils/unit-of-work.util';

export class OrderUpdatedConsumer {
  private exchange = 'orders.direct';
  private queue = 'kitchen_orders_updated_queue';
  private routingKey = 'order.updated';

  async consume() {
    const rabbit = await RabbitMQ.getInstance();
    const channel = rabbit.getChannel();

    await channel.assertExchange(this.exchange, 'direct', { durable: true });
    const q = await channel.assertQueue(this.queue, { durable: true });
    await channel.bindQueue(q.queue, this.exchange, this.routingKey);

    channel.consume(q.queue, async (msg) => {
      if (!msg) return;
      try {
        const event = JSON.parse(msg.content.toString());
        console.log('👨‍🍳 Kitchen received order update:', event);

        await UnitOfWork.execute(async (transaction) => {
          await OrderDishModel.update(
            { status: event.status as STATUS_ENUM },
            {
              where: { order_id: event.order_id, recipe_id: event.recipe_id },
              transaction,
            },
          );

          const dishes = await OrderDishModel.findAll({
            where: { order_id: event.order_id },
            transaction,
          });

          const allDone = dishes.every((d) => d.status === STATUS_ENUM.done);

          const newStatus = allDone ? STATUS_ENUM.done : STATUS_ENUM.preparing;

          await OrderModel.update(
            { status: newStatus },
            { where: { id: event.order_id }, transaction },
          );
        });

        channel.ack(msg);
      } catch (err) {
        console.error('❌ Error processing order update:', err);
        channel.nack(msg, false, true);
      }
    });

    console.log(`✅ Kitchen is listening for order updates...`);
  }
}
