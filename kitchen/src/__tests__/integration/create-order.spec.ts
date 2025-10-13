import { Sequelize } from 'sequelize-typescript';
import OrderModel from '@/models/order.model';
import { OrderRepository } from '@/repositories/mysql/order.repository';
import { STATUS_ENUM } from '@/types/enums/order-status.enum';
import OrderDishModel from '@/models/order-dishes.model';
import RecipeModel from '@/models/recipe.model';
import RecipeIngredientModel from '@/models/recipe-ingredient.model';
import IngredientModel from '@/models/ingredient.model';

describe('OrderRepository Integration', () => {
  let sequelize: Sequelize;
  let repository: OrderRepository;

  beforeAll(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
			models: [OrderModel, OrderDishModel, RecipeModel, RecipeIngredientModel, IngredientModel],
		});

    await sequelize.sync({ force: true });

    repository = new OrderRepository();
  });

	afterAll(async () => {
		if (sequelize) {
			await sequelize.close();
		}
	});

  it('should create and retrieve orders (no filter)', async () => {
    await repository.save({ plates: 1, status: STATUS_ENUM.pending, updated_at: new Date() });

    const orders = await repository.findByFilter({});

    expect(orders).toHaveLength(1);
    expect(orders![0].id).toBeDefined();
    expect(orders![0].plates).toBe(1);
    expect(orders![0].status).toBe(STATUS_ENUM.pending.toString());
  });
});
