import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import IOrderDishModel from '@models/interfaces/order-dishes.interface';
import RecipeModel from './recipe.model';
import OrderModel from './order.model';
import { STATUS_ENUM } from '@/types/enums/order-status.enum';

@Table({
  tableName: 'order_dishes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export default class OrderDishModel extends Model<
  OrderDishModel,
  IOrderDishModel
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

  @ForeignKey(() => OrderModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order_id!: number;

  @BelongsTo(() => OrderModel, {
    foreignKey: 'order_id',
    targetKey: 'id',
  })
  order!: OrderModel;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status!: STATUS_ENUM;
}
