import IOrderModel from '@/models/interfaces/order.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { IBaseRepository } from './base.repository';

export interface IOrderRepository extends IBaseRepository<IOrderModel> {
  findByFilter(
    filters: WhereOptions,
    transactions?: Transaction,
  ): Promise<IOrderModel[] | null>;
  save(
    ingredient: IOrderModel,
    transactions?: Transaction,
  ): Promise<IOrderModel>;
  bulkCreate(
    ingredient: IOrderModel[],
    transactions?: Transaction,
  ): Promise<void>;
}
