import { STATUS_ENUM } from '@/types/enums/order-status.enum';

interface IOrderModel {
  plates: number;
  status: STATUS_ENUM;
  updated_at: Date;
}

export default IOrderModel;
