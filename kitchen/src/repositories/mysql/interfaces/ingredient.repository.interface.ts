import IIngredientModel from '@/models/interfaces/ingredient.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { IBaseRepository } from './base.repository.interface';

export interface IIngredientRepository
  extends IBaseRepository<IIngredientModel> {
  findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<IIngredientModel[] | null>;
  save(
    data: IIngredientModel,
    transaction?: Transaction,
  ): Promise<IIngredientModel>;
  bulkCreate(
    data: IIngredientModel[],
    transaction?: Transaction,
  ): Promise<void>;
}
