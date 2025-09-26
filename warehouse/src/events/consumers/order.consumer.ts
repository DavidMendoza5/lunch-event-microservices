import IOrderRecipeIngredientModel from '@/models/interfaces/order-recipe-ingredient.interface';
import RabbitMQ from '../connection';
import OrderRecipeIngredientModel from '@/models/order-recipe-ingredient.model';
import IngredientModel from '@/models/ingredient.model';
import { STATUS_ENUM } from '@/types/enums/status.enum';
import { OrderUpdatedProducer } from '../producers/order-updated.producer';
import UnitOfWork from '@utils/unit-of-work.util';

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

        for (const order of orders) {
          const ingredient = await IngredientModel.findByPk(
            order.ingredient_id,
          );

          if (!ingredient) {
            console.error(`❌ Ingredient ${order.ingredient_id} not found`);
            continue;
          }

          if (ingredient.stock >= order.qty) {
            await UnitOfWork.execute(async (transaction) => {
              await ingredient.update(
                { stock: ingredient.stock - order.qty },
                { transaction },
              );
              await OrderRecipeIngredientModel.update(
                { status: STATUS_ENUM.done },
                {
                  where: {
                    ingredient_id: order.ingredient_id,
                    order_id: order.order_id,
                    recipe_id: order.recipe_id,
                  },
                  transaction,
                },
              );
            });

            const producer = new OrderUpdatedProducer();
            await producer.publish({
              order_id: order.order_id,
              recipe_id: order.recipe_id,
              ingredient_id: order.ingredient_id,
              status: STATUS_ENUM.done,
            });
          } else {
            console.log(
              `⚠️ Not enough stock for ingredient ${ingredient.name}`,
            );
          }
        }

        channel.ack(msg);
      } catch (err) {
        console.error('❌ Error processing order message:', err);
        channel.nack(msg, false, true);
      }
    });

    console.log(`✅ Warehouse is listening for orders...`);
  }
}
