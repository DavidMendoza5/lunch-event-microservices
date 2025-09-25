import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { OrderService } from '@/services/order.service';
import { IApiResponse } from '@/interfaces/api-response.interface';
import IOrderModel from '@/models/interfaces/order.interface';
import UnitOfWork from '@utils/unit-of-work.util';
import { STATUS_ENUM } from '@/types/enums/order-status.enum';

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
}
