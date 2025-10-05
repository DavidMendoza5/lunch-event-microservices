import IOrderDishModel from '@/models/interfaces/order-dishes.interface';

interface IOrderDishResponse extends Omit<IOrderDishModel, 'status'> {
  order_id: number;
  recipe_id: number;
  status: string;
  created_at?: Date;
  updated_at?: Date;
}

export default IOrderDishResponse;
