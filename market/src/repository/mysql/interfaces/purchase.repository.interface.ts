import IPurchaseModel from '@/models/interfaces/purchase.interface';
import { IBaseRepository } from './base.repository.interface';
import { Transaction, WhereOptions } from 'sequelize';

export interface IPurchaseRepository extends IBaseRepository<IPurchaseModel> {
  count(where: WhereOptions, transaction?: Transaction): Promise<number>;
}
