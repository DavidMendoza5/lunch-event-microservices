import IOrderModel from '@/models/interfaces/order.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { IBaseRepository } from './base.repository.interface';
import IOrder from '@/interfaces/order-response.interface';

export interface IOrderRepository extends IBaseRepository<IOrderModel> {
  findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<IOrder[] | null>;
  save(order: IOrderModel, transaction?: Transaction): Promise<IOrder>;
  bulkCreate(order: IOrderModel[], transaction?: Transaction): Promise<void>;
}
