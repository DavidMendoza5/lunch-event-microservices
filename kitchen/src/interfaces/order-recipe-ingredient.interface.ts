import { STATUS_ENUM } from '@/types/enums/order-status.enum';

interface IOrderRecipeIngredient {
  order_id: number;
  recipe_id: number;
  ingredient_id: number;
  status: STATUS_ENUM;
  qty: number;
}

export default IOrderRecipeIngredient;
