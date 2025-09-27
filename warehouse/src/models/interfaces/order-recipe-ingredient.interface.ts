import { STATUS_ENUM } from '@/types/enums/status.enum';

interface IOrderRecipeIngredientModel {
  order_id: number;
  recipe_id: number;
  ingredient_id: number;
  status: STATUS_ENUM;
  qty: number;
}

export default IOrderRecipeIngredientModel;
