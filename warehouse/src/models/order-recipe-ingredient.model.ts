import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import IOrderRecipeIngredientModel from '@models/interfaces/order-recipe-ingredient.interface';
import { STATUS_ENUM } from '@/types/enums/status.enum';
import IngredientModel from './ingredient.model';

@Table({
  tableName: 'order_recipe_ingredient',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export default class OrderRecipeIngredientModel extends Model<
  OrderRecipeIngredientModel,
  IOrderRecipeIngredientModel
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  recipe_id!: number;

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
    type: DataType.STRING,
    allowNull: false,
  })
  status!: STATUS_ENUM;
}
