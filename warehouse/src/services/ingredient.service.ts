import IIngredientModel from '@/models/interfaces/ingredient.interface';
import { IngredientRepository } from '@/repository/mysql/ingredient.repository';
import { AppError } from '@/utils/error.util';
import { Transaction } from 'sequelize';
import { Service } from 'typedi';

@Service()
export class IngredientService {
  constructor(private ingredientRepository: IngredientRepository) {}

  async getIngredients(
    transaction?: Transaction,
  ): Promise<IIngredientModel[] | null> {
    try {
      return await this.ingredientRepository.findByFilter({}, transaction);
    } catch (error) {
      console.error(error);
      throw new AppError('Error fetching ingredients.', 400);
    }
  }
}
