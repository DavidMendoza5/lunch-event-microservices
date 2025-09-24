import { STATUS_ENUM } from '@/types/enums/order-status.enum';

interface IOrderDishModel {
  order_id: number;
  recipe_id: number;
  status: STATUS_ENUM;
}

export default IOrderDishModel;
