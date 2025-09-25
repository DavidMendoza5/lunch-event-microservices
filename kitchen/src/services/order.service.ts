import IRecipe from '@/interfaces/recipe.interface';
import IOrderDishModel from '@/models/interfaces/order-dishes.interface';
import IOrderModel from '@/models/interfaces/order.interface';
import { OrderDishRepository } from '@/repositories/mysql/order-dish.repository';
import { OrderRepository } from '@/repositories/mysql/order.repository';
import { RecipeRepository } from '@/repositories/mysql/recipe.repository';
import { STATUS_ENUM } from '@/types/enums/order-status.enum';
import { AppError } from '@/utils/error.util';
import { Transaction } from 'sequelize';
import { Service } from 'typedi';
import RabbitMQ from '@/events/connection';
import IOrderRecipeIngredient from '@/interfaces/order-recipe-ingredient.interface';

@Service()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private recipeRepository: RecipeRepository,
    private orderDishRepository: OrderDishRepository,
  ) {}

  private getRandomWithRepetition<T>(arr: T[], count: number): T[] {
    if (arr.length === 0) return [];

    const result: T[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      result.push(arr[randomIndex]);
    }
    return result;
  }

  async createOrder(
    plates: number,
    transaction?: Transaction,
  ): Promise<IOrderModel> {
    try {
      const orderData: IOrderModel = {
        plates,
        status: STATUS_ENUM.pending,
        updated_at: new Date(),
      };
      const orderCreated = await this.orderRepository.save(
        orderData,
        transaction,
      );
      const recipes = await this.recipeRepository.findWithIngredients(
        {},
        transaction,
      );

      let dishes: IRecipe[] = [];

      if (recipes) dishes = this.getRandomWithRepetition(recipes, plates);

      const ordersWithDishesToCreate: IOrderDishModel[] = dishes.map((dish) => {
        return {
          order_id: orderCreated.id,
          recipe_id: dish.id,
          status: orderCreated.status,
        };
      });

      await this.orderDishRepository.bulkCreate(
        ordersWithDishesToCreate,
        transaction,
      );

      const message: IOrderRecipeIngredient[] = [];

      dishes.map((dish) => {
        dish.recipe_ingredients?.map((ingredient) => {
          message.push({
            order_id: orderCreated.id,
            recipe_id: dish.id,
            ingredient_id: ingredient.ingredient_id,
            status: orderCreated.status,
            qty: ingredient.qty,
          });
        });
      });

      const rabbit = await RabbitMQ.getInstance();
      const channel = rabbit.getChannel();

      const exchangeName = 'orders.direct';
      const routingKey = 'order.created';

      await channel.assertExchange(exchangeName, 'direct', { durable: true });

      channel.publish(
        exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true },
      );

      console.log('📢 Order message published');

      return orderCreated;
    } catch (error) {
      console.error(error);
      throw new AppError('Error creating an order', 400);
    }
  }
}
