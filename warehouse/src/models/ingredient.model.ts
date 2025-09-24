import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import IIngredientModel from '@models/interfaces/ingredient.interface';
import OrderRecipeIngredientModel from './order-recipe-ingredient.model';

@Table({
  tableName: 'ingredients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export default class IngredientModel extends Model<
  IngredientModel,
  IIngredientModel
> {
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
    type: DataType.INTEGER,
    allowNull: false,
  })
  stock!: number;

  @HasMany(() => OrderRecipeIngredientModel, 'ingredient_id')
  recipe_ingredients!: OrderRecipeIngredientModel[];
}
