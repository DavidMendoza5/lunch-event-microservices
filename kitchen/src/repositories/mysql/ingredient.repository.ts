import { IIngredientRepository } from '@/repositories/mysql/interfaces/ingredient.repository.interface';
import IngredientModel from '@/models/ingredient.model';
import IIngredientModel from '@/models/interfaces/ingredient.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { Service } from 'typedi';

@Service()
export class IngredientRepository implements IIngredientRepository {
  async bulkCreate(
    ingredient: IIngredientModel[],
    transaction?: Transaction,
  ): Promise<void> {
    await IngredientModel.bulkCreate(ingredient, {
      transaction,
      validate: true,
    });
  }
  async findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<IIngredientModel[] | null> {
    const ingredients = await IngredientModel.findAll({
      where: filters,
      transaction,
    });
    return ingredients.map((ingredient) => this.toDomain(ingredient));
  }
  async save(
    ingredient: IIngredientModel,
    transaction?: Transaction,
  ): Promise<IIngredientModel> {
    return await IngredientModel.create(ingredient, { transaction });
  }
  private toDomain(ingredient: IngredientModel): IIngredientModel {
    return {
      name: ingredient.name,
      updated_at: ingredient.updated_at,
    };
  }
}
