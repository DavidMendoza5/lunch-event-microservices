import { IPurchaseRepository } from '@/repository/mysql/interfaces/purchase.repository.interface';
import PurchaseModel from '@/models/purchase.model';
import IPurchaseModel from '@/models/interfaces/purchase.interface';
import { GroupOption, Transaction, WhereOptions } from 'sequelize';
import { Service } from 'typedi';
import IGetPurchase from '@/interfaces/get-purchase.interface';

@Service()
export class PurchaseRepository implements IPurchaseRepository {
  async findByFilter(
    filters: WhereOptions,
    transaction?: Transaction,
    groupedBy?: GroupOption,
    orderBy?: [string, string][],
    limit?: number,
    offset?: number,
  ): Promise<IGetPurchase[] | null> {
    const ingredients = await PurchaseModel.findAll({
      where: filters,
      transaction,
      group: groupedBy,
      order: orderBy,
      limit,
      offset,
    });
    return ingredients.map((ingredient) => this.toDomain(ingredient));
  }

  async save(
    ingredient: IPurchaseModel,
    transaction?: Transaction,
  ): Promise<IPurchaseModel> {
    return await PurchaseModel.create(ingredient, { transaction });
  }

  async count(where: WhereOptions, transaction?: Transaction): Promise<number> {
    const result = await PurchaseModel.count({
      where,
      transaction,
    });

    return result as number;
  }

  private toDomain(ingredient: PurchaseModel): IGetPurchase {
    return {
      id: ingredient.id,
      qty: ingredient.qty,
      ingredient_id: ingredient.ingredient_id,
      created_at: ingredient.created_at,
    };
  }
}
