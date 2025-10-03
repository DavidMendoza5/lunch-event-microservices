import IOrderModel from '@/models/interfaces/order.interface';
import { GroupOption, Transaction, WhereOptions } from 'sequelize';
import { IBaseRepository } from './base.repository.interface';
import IGetOrder from '@/interfaces/get-order.interface';

export interface IOrderRepository extends IBaseRepository<IOrderModel> {
  bulkCreate(order: IOrderModel[], transaction?: Transaction): Promise<void>;
  count(where: WhereOptions, transaction?: Transaction): Promise<number>;
  findWithRelations(
    filters: WhereOptions,
    transaction?: Transaction,
    groupedBy?: GroupOption,
    orderBy?: [string, string][],
    limit?: number,
    offset?: number,
  ): Promise<IGetOrder[] | null>;
}
