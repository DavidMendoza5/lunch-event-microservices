import { GroupOption, Transaction, WhereOptions } from 'sequelize';

export interface IBaseRepository<T> {
  findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
    groupedBy?: GroupOption,
    orderBy?: [string, string][],
    limit?: number,
    offset?: number,
  ): Promise<T[] | null>;
  save(data: T, transaction?: Transaction): Promise<T>;
}
