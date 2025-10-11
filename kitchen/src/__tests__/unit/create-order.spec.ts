jest.mock('@/models/order.model', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

import OrderModel from '@/models/order.model';
import { OrderRepository } from '@/repositories/mysql/order.repository';
import { STATUS_ENUM } from '@/types/enums/order-status.enum';

describe('CreateOrder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should create a new order successfully', async () => {
    const mockOrder = {
      id: 1,
      plates: 3,
      status: 'pending',
      updated_at: new Date(),
    };

    (OrderModel.create as jest.Mock).mockResolvedValue(mockOrder);

    const repo = new OrderRepository();
    const payload = {
      plates: 3,
      status: STATUS_ENUM.pending,
      updated_at: new Date(),
    };

    const result = await repo.save(payload);

    expect(OrderModel.create).toHaveBeenCalledTimes(1);
    expect(OrderModel.create).toHaveBeenCalledWith(payload, { transaction: undefined});
    expect(result).toEqual(mockOrder);
  });
});
