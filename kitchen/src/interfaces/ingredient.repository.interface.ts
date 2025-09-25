import IIngredientModel from '@/models/interfaces/ingredient.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { IBaseRepository } from './base.repository';

export interface IIngredientRepository
  extends IBaseRepository<IIngredientModel> {
  findByFilter(
    filters: WhereOptions,
    transactions?: Transaction,
  ): Promise<IIngredientModel[] | null>;
  save(
    ingredient: IIngredientModel,
    transactions?: Transaction,
  ): Promise<IIngredientModel>;
  bulkCreate(
    ingredient: IIngredientModel[],
    transactions?: Transaction,
  ): Promise<void>;
}
