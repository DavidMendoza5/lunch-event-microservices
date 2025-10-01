import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { RecipeService } from '@/services/recipe.service';
import UnitOfWork from '@utils/unit-of-work.util';
import IRecipe from '@/interfaces/recipe.interface';
import { IApiResponse } from '@/interfaces/api-response.interface';

@Service()
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  public async getDishes(
    req: Request,
    res: Response<IApiResponse<IRecipe[]>>,
    next: NextFunction,
  ): Promise<void> {
    let recipes: IRecipe[] | null = [];
    try {
      await UnitOfWork.execute(async (transaction) => {
        recipes = await this.recipeService.getRecipes(transaction);
      });

      const response: IApiResponse<IRecipe[]> = {
        success: true,
        message: 'Recipes retrieved successfully',
        data: recipes,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}
