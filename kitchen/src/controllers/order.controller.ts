import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { OrderService } from '@/services/order.service';
import { IApiResponse } from '@/interfaces/api-response.interface';
import IOrderModel from '@/models/interfaces/order.interface';

@Service()
export class OrderController {
  constructor(private orderService: OrderService) {
  }

  public async createOrder(
    req: Request,
    res: Response<IApiResponse<IOrderModel>>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const order = await this.orderService.createOrder(req.body.plates);
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
