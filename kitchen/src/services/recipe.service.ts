import IRecipe from '@/interfaces/recipe.interface';
import { RecipeRepository } from '@/repositories/mysql/recipe.repository';
import { AppError } from '@/utils/error.util';
import { Transaction } from 'sequelize';
import { Service } from 'typedi';

@Service()
export class RecipeService {
  constructor(private recipeRepository: RecipeRepository) {}

  async getRecipes(transaction?: Transaction): Promise<IRecipe[] | null> {
    try {
      return await this.recipeRepository.findWithIngredients(
        {},
        transaction,
        true,
      );
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw new AppError('Error fetching recipes', 400);
    }
  }
}
