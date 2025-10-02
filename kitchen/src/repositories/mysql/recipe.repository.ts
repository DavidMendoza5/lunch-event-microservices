import { IRecipeRepository } from '@/repositories/mysql/interfaces/recipe.repository.interface';
import RecipeModel from '@/models/recipe.model';
import IRecipeModel from '@/models/interfaces/recipe.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { Service } from 'typedi';
import RecipeIngredientModel from '@/models/recipe-ingredient.model';
import IRecipe from '@/interfaces/recipe.interface';
import IngredientModel from '@/models/ingredient.model';

@Service()
export class RecipeRepository implements IRecipeRepository {
  async findWithIngredients(
    filters: WhereOptions,
    transaction?: Transaction,
    withAll?: boolean,
  ): Promise<IRecipe[] | null> {
    const recipes = await RecipeModel.findAll({
      where: filters,
      include: [
        {
          model: RecipeIngredientModel,
          as: 'recipe_ingredients',
          attributes: ['id', 'ingredient_id', 'recipe_id', 'qty'],
          include: withAll
            ? [
                {
                  model: IngredientModel,
                  as: 'ingredient',
                  attributes: ['id', 'name'],
                },
              ]
            : [],
        },
      ],
      transaction,
    });
    return recipes.map((recipe) => this.toDomainWithRelations(recipe));
  }
  async findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<IRecipe[] | null> {
    const recipes = await RecipeModel.findAll({
      where: filters,
      transaction,
    });
    return recipes.map((recipe) => this.toDomain(recipe));
  }
  async save(
    recipe: IRecipeModel,
    transaction?: Transaction,
  ): Promise<IRecipe> {
    return await RecipeModel.create(recipe, { transaction });
  }

  private toDomain(recipe: RecipeModel): IRecipe {
    return {
      id: recipe.id,
      name: recipe.name,
      updated_at: recipe.updated_at,
    };
  }

  private toDomainWithRelations(recipe: RecipeModel): IRecipe {
    return {
      id: recipe.id,
      name: recipe.name,
      updated_at: recipe.updated_at,
      recipe_ingredients: recipe.recipe_ingredients
        ? recipe.recipe_ingredients.map((ri) => ({
            id: ri.id,
            ingredient_id: ri.ingredient_id,
            recipe_id: ri.recipe_id,
            qty: ri.qty,
            ingredient_name: ri.ingredient ? ri.ingredient.name : undefined,
          }))
        : undefined,
    };
  }
}
