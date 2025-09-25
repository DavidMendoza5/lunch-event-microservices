import IOrderModel from '@/models/interfaces/order.interface';
import { OrderRepository } from '@/repositories/mysql/order.repository';
import { STATUS_ENUM } from '@/types/enums/order-status.enum';
import { AppError } from '@/utils/error.util';
import { Service } from 'typedi';

@Service()
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
  ) {}

  async createOrder(plates: number): Promise<IOrderModel> {
    try {
      const orderData: IOrderModel = {
        plates,
        status: STATUS_ENUM.pending,
        updated_at: new Date(),
      };
      return await this.orderRepository.save(orderData);
    } catch (error) {
      console.error(error);

      throw new AppError('Error creating an order', 400);
    }
  }
}
