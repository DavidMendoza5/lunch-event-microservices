import { Transaction, WhereOptions } from 'sequelize';

export interface IBaseRepository<T> {
  findByFilter(
    filters: WhereOptions,
    transactions?: Transaction,
  ): Promise<T[] | null>;
  save(data: T, transactions?: Transaction): Promise<T>;
  bulkCreate(data: T[], transactions?: Transaction): Promise<void>;
}
