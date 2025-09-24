import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import IIngredientModel from '@models/interfaces/ingredient.interface';
import RecipeIngredientModel from './recipe-ingredient.model';

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

  @HasMany(() => RecipeIngredientModel, 'recipe_id')
  recipe_ingredients!: RecipeIngredientModel[];
}
