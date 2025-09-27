import { Transaction, WhereOptions } from 'sequelize';
import { Service } from 'typedi';
import OrderDishModel from '@/models/order-dishes.model';
import IOrderDishModel from '@/models/interfaces/order-dishes.interface';
import { IOrderDishRepository } from './interfaces/order-dishes.repository.interface';

@Service()
export class OrderDishRepository implements IOrderDishRepository {
  async bulkCreate(
    order: IOrderDishModel[],
    transaction?: Transaction,
  ): Promise<void> {
    await OrderDishModel.bulkCreate(order, {
      transaction,
      validate: true,
    });
  }
  async findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<IOrderDishModel[] | null> {
    const recipeIngredients = await OrderDishModel.findAll({
      where: filters,
      transaction,
    });
    return recipeIngredients.map((value) => this.toDomain(value));
  }
  async save(
    data: IOrderDishModel,
    transaction?: Transaction,
  ): Promise<IOrderDishModel> {
    return await OrderDishModel.create(data, { transaction });
  }
  private toDomain(data: OrderDishModel): IOrderDishModel {
    return {
      order_id: data.order_id,
      recipe_id: data.recipe_id,
      status: data.status,
    };
  }
}
