import IPurchaseModel from '@/models/interfaces/purchase.interface';

export default interface IGetPurchase extends IPurchaseModel {
  id: number;
  created_at: Date;
}
