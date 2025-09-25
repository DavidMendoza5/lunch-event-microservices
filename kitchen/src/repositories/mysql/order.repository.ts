import { IOrderRepository } from '@/interfaces/order.repository.interface';
import OrderModel from '@/models/order.model';
import IOrderModel from '@/models/interfaces/order.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { Service } from 'typedi';

@Service()
export class OrderRepository implements IOrderRepository {
  async bulkCreate(
    ingredient: IOrderModel[],
    transaction?: Transaction,
  ): Promise<void> {
    await OrderModel.bulkCreate(ingredient, {
      transaction,
      validate: true,
    });
  }
  async findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<IOrderModel[] | null> {
    const ingredients = await OrderModel.findAll({
      where: filters,
      transaction,
    });
    return ingredients.map((ingredient) => this.toDomain(ingredient));
  }
  async save(
    ingredient: IOrderModel,
    transaction?: Transaction,
  ): Promise<IOrderModel> {
    return await OrderModel.create(ingredient, { transaction });
  }
  private toDomain(ingredient: OrderModel): IOrderModel {
    return {
      plates: ingredient.plates,
      status: ingredient.status,
      updated_at: ingredient.updated_at,
    };
  }
}
