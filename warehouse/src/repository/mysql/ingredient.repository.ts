import { IIngredientRepository } from '@/repository/mysql/interfaces/ingredient.repository.interface';
import IngredientModel from '@/models/ingredient.model';
import IIngredientModel from '@/models/interfaces/ingredient.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { Service } from 'typedi';
import IGetIngredient from '@/interfaces/get-ingredient.interface';

@Service()
export class IngredientRepository implements IIngredientRepository {
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
  private toDomain(ingredient: IngredientModel): IGetIngredient {
    return {
      id: ingredient.id,
      name: ingredient.name,
      stock: ingredient.stock,
      updated_at: ingredient.updatedAt,
    };
  }
}
