import { IRecipeIngredientRepository } from '@/repositories/mysql/interfaces/recipe-ingredient.repository.interface';
import RecipeIngredientModel from '@/models/recipe-ingredient.model';
import IRecipeIngredientModel from '@/models/interfaces/recipe-ingredient.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { Service } from 'typedi';

@Service()
export class RecipeRepository implements IRecipeIngredientRepository {
  async findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<IRecipeIngredientModel[] | null> {
    const recipeIngredients = await RecipeIngredientModel.findAll({
      where: filters,
      transaction,
    });
    return recipeIngredients.map((value) => this.toDomain(value));
  }
  async save(
    data: IRecipeIngredientModel,
    transaction?: Transaction,
  ): Promise<IRecipeIngredientModel> {
    return await RecipeIngredientModel.create(data, { transaction });
  }
  private toDomain(data: RecipeIngredientModel): IRecipeIngredientModel {
    return {
      ingredient_id: data.ingredient_id,
      recipe_id: data.recipe_id,
      qty: data.qty,
    };
  }
}
