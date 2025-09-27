import IOrderRecipeIngredientModel from '@/models/interfaces/order-recipe-ingredient.interface';
import { Transaction, WhereOptions } from 'sequelize';
import { Service } from 'typedi';
import { IOrderRecipeIngredientRepository } from './interfaces/order-recipe-ingredient.repository.interface';
import IOrderRecipeIngredient from '@/interfaces/order-recipe-ingredient.interface';
import OrderRecipeIngredientModel from '@/models/order-recipe-ingredient.model';

@Service()
export class OrderRecipeIngredientRepository
  implements IOrderRecipeIngredientRepository
{
  async bulkCreate(
    data: IOrderRecipeIngredientModel[],
    transaction?: Transaction,
  ): Promise<void> {
    await OrderRecipeIngredientModel.bulkCreate(data, {
      transaction,
      validate: true,
    });
  }
  async findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
  ): Promise<IOrderRecipeIngredient[] | null> {
    const recipeIngredients = await OrderRecipeIngredientModel.findAll({
      where: filters,
      transaction,
    });
    return recipeIngredients.map((value) => this.toDomain(value));
  }
  async save(
    data: IOrderRecipeIngredientModel,
    transaction?: Transaction,
  ): Promise<IOrderRecipeIngredient> {
    return await OrderRecipeIngredientModel.create(data, { transaction });
  }
  private toDomain(data: OrderRecipeIngredientModel): IOrderRecipeIngredient {
    return {
      id: data.id,
      ingredient_id: data.ingredient_id,
      recipe_id: data.recipe_id,
      order_id: data.order_id,
      status: data.status,
      qty: data.qty,
    };
  }
}
