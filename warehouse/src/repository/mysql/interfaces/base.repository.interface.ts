import { Transaction, WhereOptions } from 'sequelize';

export interface IBaseRepository<T> {
  findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<T[] | null>;
  save(data: T, transaction?: Transaction): Promise<T>;
}
