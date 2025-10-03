import IOrderDishModel from '@/models/interfaces/order-dishes.interface';
import { Transaction } from 'sequelize';
import { IBaseRepository } from './base.repository.interface';

export interface IOrderDishRepository extends IBaseRepository<IOrderDishModel> {
  bulkCreate(data: IOrderDishModel[], transaction?: Transaction): Promise<void>;
}
