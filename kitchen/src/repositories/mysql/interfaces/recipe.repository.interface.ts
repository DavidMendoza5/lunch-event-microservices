import IRecipeModel from '@/models/interfaces/recipe.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { IBaseRepository } from './base.repository.interface';
import IRecipe from '@/interfaces/recipe.interface';

export interface IRecipeRepository extends IBaseRepository<IRecipeModel> {
  findWithIngredients(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<IRecipe[] | null>;
}
