jest.mock('@/models/recipe.model', () => ({
  __esModule: true,
  default: {
    findAll: jest.fn(),
  },
}));

import RecipeModel from '@/models/recipe.model';
import { RecipeRepository } from '@/repositories/mysql/recipe.repository';

describe('GetRecipes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return all recipes', async () => {
    const mockRecipes = [
      {
        id: 1,
        name: 'Tacos',
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'Pozole',
        updated_at: new Date(),
      },
    ];

    (RecipeModel.findAll as jest.Mock).mockResolvedValue(mockRecipes);

    const repo = new RecipeRepository();
    const result = await repo.findByFilter({});

    expect(RecipeModel.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
  });

  it('Should return all recipes with its ingredients', async () => {
    const mockRecipes = [
      {
        id: 1,
        name: 'Tacos',
        updated_at: new Date(),
        recipe_ingredients: [
          { id: 1, recipe_id: 1, ingredient_id: 10, qty: 2 },
          { id: 2, recipe_id: 1, ingredient_id: 11, qty: 3 },
        ],
      },
      {
        id: 2,
        name: 'Pozole',
        updated_at: new Date(),
        recipe_ingredients: [
          { id: 3, recipe_id: 2, ingredient_id: 12, qty: 1 },
        ],
      },
    ];

    (RecipeModel.findAll as jest.Mock).mockResolvedValue(mockRecipes);

    const repo = new RecipeRepository();
    const result = await repo.findWithIngredients({});

    expect(RecipeModel.findAll).toHaveBeenCalledTimes(1);
    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
  });
});
