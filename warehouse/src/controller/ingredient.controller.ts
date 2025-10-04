import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import UnitOfWork from '@utils/unit-of-work.util';
import { IApiResponse } from '@/interfaces/api-response.interface';
import { IngredientService } from '@/services/ingredient.service';
import IIngredientModel from '@/models/interfaces/ingredient.interface';

@Service()
export class IngredientController {
  constructor(private ingredientService: IngredientService) {}

  public async getIngredients(
    req: Request,
    res: Response<IApiResponse<IIngredientModel[]>>,
    next: NextFunction,
  ): Promise<void> {
    let ingredients: IIngredientModel[] | null = [];
    try {
      await UnitOfWork.execute(async (transaction) => {
        ingredients = await this.ingredientService.getIngredients(transaction);
      });

      const response: IApiResponse<IIngredientModel[]> = {
        success: true,
        message: 'Ingredients retrieved successfully',
        data: ingredients,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}
