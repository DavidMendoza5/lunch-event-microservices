import IRecipeModel from '@/models/interfaces/recipe.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { IBaseRepository } from './base.repository.interface';
import IRecipe from '@/interfaces/recipe.interface';

export interface IRecipeRepository extends IBaseRepository<IRecipeModel> {
  findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<IRecipe[] | null>;
  save(recipe: IRecipeModel, transactions?: Transaction): Promise<IRecipe>;
  findWithIngredients(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<IRecipe[] | null>;
}
