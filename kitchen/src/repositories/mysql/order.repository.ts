import { IOrderRepository } from '@/repositories/mysql/interfaces/order.repository.interface';
import OrderModel from '@/models/order.model';
import IOrderModel from '@/models/interfaces/order.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { Service } from 'typedi';
import IOrder from '@/interfaces/order-response.interface';

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
  ): Promise<IOrder[] | null> {
    const orders = await OrderModel.findAll({
      where: filters,
      transaction,
    });
    return orders.map((order) => this.toDomain(order));
  }
  async save(order: IOrderModel, transaction?: Transaction): Promise<IOrder> {
    return await OrderModel.create(order, { transaction });
  }
  private toDomain(order: OrderModel): IOrder {
    return {
      id: order.id,
      plates: order.plates,
      status: order.status,
      updated_at: order.updated_at,
    };
  }
}
