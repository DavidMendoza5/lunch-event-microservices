import { IOrderRepository } from '@/repositories/mysql/interfaces/order.repository.interface';
import OrderModel from '@/models/order.model';
import IOrderModel from '@/models/interfaces/order.interface';
import { GroupOption, Transaction, WhereOptions } from 'sequelize';
import { Service } from 'typedi';
import IOrder from '@/interfaces/order-response.interface';
import OrderDishModel from '@/models/order-dishes.model';
import RecipeModel from '@/models/recipe.model';
import { STATUS_ENUM } from '@/types/enums/order-status.enum';
import IGetOrder from '@/interfaces/get-order.interface';

@Service()
export class OrderRepository implements IOrderRepository {
  async bulkCreate(
    order: IOrderModel[],
    transaction?: Transaction,
  ): Promise<void> {
    await OrderModel.bulkCreate(order, {
      transaction,
      validate: true,
    });
  }

  async findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
    groupedBy?: GroupOption,
    orderBy?: [string, string][],
    limit?: number,
    offset?: number,
  ): Promise<IOrder[] | null> {
    const orders = await OrderModel.findAll({
      where: filters,
      transaction,
      group: groupedBy,
      order: orderBy,
      limit,
      offset,
    });
    return orders.map((order) => this.toDomain(order));
  }

  async save(order: IOrderModel, transaction?: Transaction): Promise<IOrder> {
    return await OrderModel.create(order, { transaction });
  }

  async count(where: WhereOptions, transaction?: Transaction): Promise<number> {
    const result = await OrderModel.count({
      where,
      transaction,
    });

    return result as number;
  }

  async findWithRelations(
    filters: WhereOptions,
    transaction?: Transaction,
    groupedBy?: GroupOption,
    orderBy?: [string, string][],
    limit?: number,
    offset?: number,
  ): Promise<IGetOrder[] | null> {
    const orderDishes = await OrderModel.findAll({
      where: filters,
      group: groupedBy,
      order: orderBy,
      limit,
      offset,
      transaction,
      include: [
        {
          model: OrderDishModel,
          as: 'orders_dishes',
          attributes: ['id', 'recipe_id', 'status'],
          include: [
            {
              model: RecipeModel,
              as: 'recipe',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    return orderDishes.map((value) => this.toDomainWithRelations(value));
  }

  private toDomain(order: OrderModel): IOrder {
    return {
      id: order.id,
      plates: order.plates,
      status: order.status,
      updated_at: order.updated_at,
    };
  }

  private toDomainWithRelations(order: OrderModel): IGetOrder {
    return {
      id: order.id,
      plates: order.plates,
      status: STATUS_ENUM[order.status],
      updated_at: order.updated_at,
      orders_dishes: order.orders_dishes
        ? order.orders_dishes.map((od) => ({
            order_id: od.order_id,
            recipe_id: od.recipe_id,
            status: STATUS_ENUM[od.status],
            recipe_name: od.recipe ? od.recipe.name : undefined,
          }))
        : undefined,
    };
  }
}
