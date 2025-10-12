jest.mock('@/models/ingredient.model', () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
  },
}));

import IngredientModel from "@/models/ingredient.model";
import { IngredientRepository } from "@/repository/mysql/ingredient.repository";

describe('GetInventory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return all ingredients', async () => {
    (IngredientModel.findAll as jest.Mock).mockResolvedValue([
      { id: 1, name: "rice", stock: 2, recipe_ingredients: 2 },
      { id: 2, name: "tomato", stock: 3, recipe_ingredients: 1 }
    ]);

    const repo = new IngredientRepository();
    const result = await repo.findByFilter({});

    expect(IngredientModel.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
  })
})