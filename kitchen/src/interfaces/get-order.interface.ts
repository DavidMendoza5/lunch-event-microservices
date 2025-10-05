import IOrderModel from '@/models/interfaces/order.interface';
import IOrderDishResponse from './order-dish-response.interface';

interface IGetOrder extends Omit<IOrderModel, 'status'> {
  id: number;
  status: string;
  orders_dishes?: IOrderDishResponse[];
  created_at?: Date;
}

export default IGetOrder;
