import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import UnitOfWork from '@utils/unit-of-work.util';
import { IApiPaginatedResponse } from '@/interfaces/api-paginated-response.interface';
import IGetPurchase from '@/interfaces/get-purchase.interface';
import { IDataWithPagination } from '@/interfaces/get-paginated-data.interface';
import { IPaginatedPurchaseFilters } from '@/interfaces/purchase-filters.interface';
import { PurchaseService } from '@/services/purchase.service';

@Service()
export class PurchaseContoller {
  constructor(private purchaseService: PurchaseService) {}

  public async getPurchases(
    req: Request<{}, {}, {}, IPaginatedPurchaseFilters>,
    res: Response<IApiPaginatedResponse<IGetPurchase>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queryParams = req.query;
      const limit = queryParams.limit;
      let purchasesInformation: IDataWithPagination<IGetPurchase> = {
        data: [],
        totalData: 0,
        totalPages: 0,
      };

      await UnitOfWork.execute(async (transaction) => {
        purchasesInformation = await this.purchaseService.getPurchases(
          queryParams,
          transaction,
        );
      });

      const currentPage = Number(queryParams.pageNumber) || 1;
      const itemsPerPage = Number(limit);

      const startItem =
        purchasesInformation.data.length > 0
          ? (currentPage - 1) * itemsPerPage + 1
          : 0;
      const endItem =
        purchasesInformation.data.length > 0
          ? startItem + purchasesInformation.data.length - 1
          : 0;

      const response: IApiPaginatedResponse<IGetPurchase> = {
        success: true,
        message: 'Purchases retrieved successfully',
        data: purchasesInformation.data,
        pagination: {
          currentPage: Number(queryParams.pageNumber) || 1,
          totalPages: purchasesInformation.totalPages,
          totalItems: purchasesInformation.totalData,
          itemsPerPage: Number(limit),
          startItem,
          endItem,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
