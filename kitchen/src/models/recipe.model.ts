import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import IRecipeModel from '@models/interfaces/recipe.interface';
import RecipeIngredientModel from './recipe-ingredient.model';
import OrderDishModel from './order-dishes.model';

@Table({
  tableName: 'recipes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export default class RecipeModel extends Model<RecipeModel, IRecipeModel> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updated_at!: Date;

  @HasMany(() => RecipeIngredientModel, 'recipe_id')
  recipe_ingredients!: RecipeIngredientModel[];

  @HasMany(() => OrderDishModel, 'recipe_id')
  orders_dishes!: OrderDishModel[];
}
