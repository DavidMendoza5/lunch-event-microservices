jest.mock('@/models/purchase.model', () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
  },
}));

import PurchaseModel from "@/models/purchase.model";
import { PurchaseRepository } from "@/repository/mysql/purchase.repository";

describe('GetPurchases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return all purchases', async () => {
    (PurchaseModel.findAll as jest.Mock).mockResolvedValue([
      { id: 1, ingredient_id: 2, qty: 2, created_at: new Date() },
      { id: 2, ingredient_id: 3, qty: 1, created_at: new Date() }
    ]);

    const repo = new PurchaseRepository();
    const result = await repo.findByFilter({});

    expect(PurchaseModel.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
  })
})