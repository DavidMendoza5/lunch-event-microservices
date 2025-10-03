import IOrderDishModel from '@/models/interfaces/order-dishes.interface';
import IOrderModel from '@/models/interfaces/order.interface';

interface IOrder extends IOrderModel {
  id: number;
  orders_dishes?: IOrderDishModel[];
}

export default IOrder;
