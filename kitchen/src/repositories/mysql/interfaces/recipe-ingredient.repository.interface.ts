import IRecipeIngredientModel from '@/models/interfaces/recipe-ingredient.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { IBaseRepository } from './base.repository.interface';

export interface IRecipeIngredientRepository
  extends IBaseRepository<IRecipeIngredientModel> {
  findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<IRecipeIngredientModel[] | null>;
  save(
    data: IRecipeIngredientModel,
    transaction?: Transaction,
  ): Promise<IRecipeIngredientModel>;
}
