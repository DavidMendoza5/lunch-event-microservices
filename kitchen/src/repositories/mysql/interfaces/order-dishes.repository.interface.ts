import IOrderDishModel from '@/models/interfaces/order-dishes.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { IBaseRepository } from './base.repository.interface';

export interface IOrderDishRepository extends IBaseRepository<IOrderDishModel> {
  findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<IOrderDishModel[] | null>;
  save(
    data: IOrderDishModel,
    transaction?: Transaction,
  ): Promise<IOrderDishModel>;
  bulkCreate(data: IOrderDishModel[], transaction?: Transaction): Promise<void>;
}
