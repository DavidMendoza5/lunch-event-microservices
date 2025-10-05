import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import IOrderModel from '@models/interfaces/order.interface';
import { STATUS_ENUM } from '@/types/enums/order-status.enum';
import OrderDishModel from './order-dishes.model';

@Table({
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export default class OrderModel extends Model<OrderModel, IOrderModel> {
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
  plates!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status!: STATUS_ENUM;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updated_at!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  created_at?: Date;

  @HasMany(() => OrderDishModel, 'order_id')
  orders_dishes!: OrderDishModel[];
}
