import { Op } from 'sequelize';
import RabbitMQ from '../connection';
import OrderRecipeIngredientModel from '@/models/order-recipe-ingredient.model';
import IngredientModel from '@/models/ingredient.model';
import { STATUS_ENUM } from '@/types/enums/status.enum';
import { OrderUpdatedProducer } from '../producers/order-updated.producer';
import UnitOfWork from '@utils/unit-of-work.util';
import { IngredientBuyProducer } from '../producers/ingredient-purchase.producer';

export class IngredientPurchaseConsumer {
  private exchange = 'market.direct';
  private queue = 'market_purchase_update_queue';
  private routingKey = 'market.response.purchase';

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
        const purchase = JSON.parse(msg.content.toString());
        console.log('🍽️ Warehouse received purchases:', purchase);

        const ingredients = await IngredientModel.findAll();
        const ingredientPurchased = ingredients.find(
          (ingredient) => ingredient.id === purchase.ingredient_id,
        );

        if (!ingredientPurchased)
          console.error(`❌ Ingredient ${purchase.ingredient_id} not found`);

        let newQty = Number(purchase.qty);

        if (ingredientPurchased) {
          newQty += Number(ingredientPurchased.stock);
        }

        const ordersWithRecipes = await OrderRecipeIngredientModel.findAll({
          where: {
            order_id: purchase.order_id,
            ingredient_id: purchase.ingredient_id,
            status: {
              [Op.ne]: STATUS_ENUM.done,
            },
          },
        });

        const orderToUpdate: OrderRecipeIngredientModel[] = [];
        const pendingIngredients = [];

        for (const order of ordersWithRecipes) {
          if (newQty <= 0 || order.qty > newQty) {
            pendingIngredients.push(order);
            continue;
          }

          if (order.qty <= newQty) {
            newQty -= order.qty;
            orderToUpdate.push(order);
          }
        }

        await UnitOfWork.execute(async (transaction) => {
          await IngredientModel.update(
            { stock: newQty },
            { where: { id: purchase.ingredient_id }, transaction },
          );

          const orderIdsToUpdate = orderToUpdate.map((order) => order.id);

          await OrderRecipeIngredientModel.update(
            { status: STATUS_ENUM.done },
            { where: { id: { [Op.in]: orderIdsToUpdate } }, transaction },
          );
        });

        for (const order of orderToUpdate) {
          const producer = new OrderUpdatedProducer();
          await producer.publish({
            order_id: order.order_id,
            recipe_id: order.recipe_id,
            ingredient_id: order.ingredient_id,
            status: STATUS_ENUM.done,
          });
        }

        for (const order of pendingIngredients) {
          if (ingredientPurchased) {
            const ingredientBuyProducer = new IngredientBuyProducer();

            await ingredientBuyProducer.publish({
              order_id: order.order_id,
              recipe_id: order.recipe_id,
              ingredient_id: order.ingredient_id,
              ingredient_name: ingredientPurchased.name,
              qty: order.qty,
            });
          }
        }

        channel.ack(msg);
      } catch (err) {
        console.error('❌ Error processing order message:', err);
        channel.nack(msg, false, true);
      }
    });

    console.log(`✅ Warehouse is listening for purchases...`);
  }
}
