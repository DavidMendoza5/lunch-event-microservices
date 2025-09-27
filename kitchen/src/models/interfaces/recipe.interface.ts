import IRecipeIngredientModel from './recipe-ingredient.interface';

interface IRecipeModel {
  name: string;
  updated_at: Date;
  recipe_ingredients?: IRecipeIngredientModel[];
}

export default IRecipeModel;
