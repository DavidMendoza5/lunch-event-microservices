import thirdPartyDomain from '@/config/third-party-domains';
import RabbitMQ from '../connection';
import { AppError } from '@/utils/error.util';
import PurchaseModel from '@/models/purchase.model';
import { IngredientPurchaseProducer } from '../producers/ingredient-purchase.producer';

export class IngredientPurchaseConsumer {
  private exchange = 'market.direct';
  private queue = 'market_purchase_queue';
  private routingKey = 'market.request.purchase';

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
        console.log('👨‍🍳 Purchase order received:', event);
        console.log(
          'ALREGRA:',
          `${thirdPartyDomain.alegra}/api/farmers-market/buy?ingredient=${event.ingredient_name}`,
        );

        const fetchResponse = await fetch(
          `${thirdPartyDomain.alegra}/api/farmers-market/buy?ingredient=${event.ingredient_name}`,
        );
        if (!fetchResponse.ok) {
          throw new AppError(`Error fetching data`, fetchResponse.status);
        }
        const qtyPurchased = await fetchResponse.json();

        await PurchaseModel.create({
          ingredient_id: event.ingredient_id,
          qty: qtyPurchased.quantitySold,
        });

        console.log(
          `👨‍🍳 Ingredient ${event.ingredient_id} purchased:`,
          qtyPurchased.quantitySold,
        );

        const purchaseProducer = new IngredientPurchaseProducer();
        purchaseProducer.publish({
          qty: qtyPurchased.quantitySold,
          ingredient_id: event.ingredient_id,
          order_id: event.order_id,
          recipe_id: event.recipe_id,
        });

        channel.ack(msg);
      } catch (err) {
        console.error('❌ Error processing purchase:', err);
        channel.nack(msg, false, true);
      }
    });

    console.log(`✅ Market is listening for purchases...`);
  }
}
