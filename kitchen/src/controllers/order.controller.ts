import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { OrderService } from '@/services/order.service';
import { IApiResponse } from '@/interfaces/api-response.interface';
import IOrderModel from '@/models/interfaces/order.interface';
import UnitOfWork from '@utils/unit-of-work.util';
import { STATUS_ENUM } from '@/types/enums/order-status.enum';
import { IPaginatedOrderFilters } from '@/interfaces/order-filters.interface';
import { IApiPaginatedResponse } from '@/interfaces/api-paginated-response.interface';
import { IDataWithPagination } from '@/interfaces/get-paginated-data.interface';
import IGetOrder from '@/interfaces/get-order.interface';

@Service()
export class OrderController {
  constructor(private orderService: OrderService) {}

  public async createOrder(
    req: Request,
    res: Response<IApiResponse<IOrderModel>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      let order: IOrderModel = {
        plates: 0,
        status: STATUS_ENUM.pending,
        updated_at: new Date(),
      };

      await UnitOfWork.execute(async (transaction) => {
        order = await this.orderService.createOrder(
          req.body.plates,
          transaction,
        );
      });

      const response: IApiResponse<IOrderModel> = {
        success: true,
        message: 'Order created successfully',
        data: order,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async getOrdersWithRecipes(
    req: Request<{}, {}, {}, IPaginatedOrderFilters>,
    res: Response<IApiPaginatedResponse<IGetOrder>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const queryParams = req.query;
      const limit = queryParams.limit;
      let ordersInformation: IDataWithPagination<IGetOrder> = {
        data: [],
        totalData: 0,
        totalPages: 0,
      };

      await UnitOfWork.execute(async (transaction) => {
        ordersInformation = await this.orderService.getOrdersWithRecipes(
          queryParams,
          transaction,
        );
      });
      const currentPage = Number(queryParams.pageNumber) || 1;
      const itemsPerPage = Number(limit);

      const startItem =
        ordersInformation.data.length > 0
          ? (currentPage - 1) * itemsPerPage + 1
          : 0;
      const endItem =
        ordersInformation.data.length > 0
          ? startItem + ordersInformation.data.length - 1
          : 0;

      const response: IApiPaginatedResponse<IGetOrder> = {
        success: true,
        message: 'Orders retrieved successfully',
        data: ordersInformation.data,
        pagination: {
          currentPage,
          totalPages: ordersInformation.totalPages,
          totalItems: ordersInformation.totalData,
          itemsPerPage,
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
