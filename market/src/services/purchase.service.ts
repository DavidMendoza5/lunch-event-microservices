import serverConfig from '@/config/server';
import { IDataWithPagination } from '@/interfaces/get-paginated-data.interface';
import IGetPurchase from '@/interfaces/get-purchase.interface';
import { IPaginatedPurchaseFilters } from '@/interfaces/purchase-filters.interface';
import { PurchaseRepository } from '@/repository/mysql/purchase.repository';
import { AppError } from '@/utils/error.util';
import { Transaction, WhereOptions } from 'sequelize';
import { Service } from 'typedi';

@Service()
export class PurchaseService {
  constructor(private purchaseRepository: PurchaseRepository) {}

  async getPurchases(
    filters: IPaginatedPurchaseFilters,
    transaction?: Transaction,
  ): Promise<IDataWithPagination<IGetPurchase>> {
    try {
      const {
        limit = serverConfig.paginationLimit,
        pageNumber = 1,
        sortBy,
        sortOrder,
      } = filters;
      const offset = (pageNumber - 1) * limit;
      const purchaseFilters: WhereOptions = {};

      const totalPurchases = await this.purchaseRepository.count(
        purchaseFilters,
        transaction,
      );

      const totalPages = Math.ceil(totalPurchases / limit);

      const purchases = await this.purchaseRepository.findByFilter(
        purchaseFilters,
        transaction,
        undefined,
        [[sortBy || 'id', sortOrder || 'DESC']],
        Number(limit),
        offset,
      );

      return {
        data: purchases || [],
        totalData: totalPurchases,
        totalPages,
      };
    } catch (error) {
      throw new AppError('Error getting purchases', 400);
    }
  }
}
