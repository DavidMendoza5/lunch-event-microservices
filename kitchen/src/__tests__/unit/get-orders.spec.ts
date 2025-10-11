jest.mock('@/models/order.model', () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
  },
}));

import OrderModel from "@/models/order.model";
import { OrderRepository } from "@/repositories/mysql/order.repository";

describe('GetOrders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return all orders', async () => {
    (OrderModel.findAll as jest.Mock).mockResolvedValue([
      { id: 1, plates: 2, status: 'pending', updated_at: new Date() },
      { id: 2, plates: 3, status: 'completed', updated_at: new Date() }
    ]);

    const repo = new OrderRepository();
    const result = await repo.findByFilter({});

    expect(OrderModel.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
  })

  it('Should return all pending orders', async () => {
    (OrderModel.findAll as jest.Mock).mockResolvedValue([
      { id: 1, plates: 2, status: 'pending', updated_at: new Date() },
    ]);

    const repo = new OrderRepository();
    const result = await repo.findByFilter({ status: 'pending' });

    expect(OrderModel.findAll).toHaveBeenCalledTimes(1);
    expect(OrderModel.findAll).toHaveBeenCalledWith({ where: { status: 'pending' } })
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result![0]).toHaveProperty("status", "pending");
  })
})