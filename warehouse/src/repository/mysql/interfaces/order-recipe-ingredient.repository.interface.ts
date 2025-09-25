import IOrderRecipeModel from '@/models/interfaces/order-recipe-ingredient.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { IBaseRepository } from './base.repository.interface';
import IOrderRecipeIngredient from '@/interfaces/order-recipe-ingredient.interface';

export interface IOrderRecipeIngredientRepository
  extends IBaseRepository<IOrderRecipeModel> {
  findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<IOrderRecipeIngredient[] | null>;
  save(
    data: IOrderRecipeModel,
    transaction?: Transaction,
  ): Promise<IOrderRecipeIngredient>;
  bulkCreate(
    data: IOrderRecipeModel[],
    transaction?: Transaction,
  ): Promise<void>;
}
