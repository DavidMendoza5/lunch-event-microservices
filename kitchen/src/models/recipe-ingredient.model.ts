import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import IRecipeIngredientModel from '@models/interfaces/recipe-ingredient.interface';
import RecipeModel from './recipe.model';
import IngredientModel from './ingredient.model';

@Table({
  tableName: 'recipe_ingredients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export default class RecipeIngredientModel extends Model<
  RecipeIngredientModel,
  IRecipeIngredientModel
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => RecipeModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  recipe_id!: number;

  @BelongsTo(() => RecipeModel, {
    foreignKey: 'recipe_id',
    targetKey: 'id',
  })
  recipe!: RecipeModel;

  @ForeignKey(() => IngredientModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ingredient_id!: number;

  @BelongsTo(() => IngredientModel, {
    foreignKey: 'ingredient_id',
    targetKey: 'id',
  })
  ingredient!: IngredientModel;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  qty!: number;
}
