import { Table, Column, Model, DataType } from 'sequelize-typescript';
import IPurchaseModel from '@models/interfaces/purchase.interface';

@Table({
  tableName: 'purchases',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export default class PurchaseModel extends Model<
  PurchaseModel,
  IPurchaseModel
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
  ingredient_id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  qty!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at!: Date;
}
