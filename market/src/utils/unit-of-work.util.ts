import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import sequelize from '@models/index';

class UnitOfWork {
  private sequelize: Sequelize;

  constructor(sequelizeInstance: Sequelize) {
    this.sequelize = sequelizeInstance;
  }

  async execute<T>(
    callback: (transaction: Transaction) => Promise<T>,
  ): Promise<T> {
    const transaction = await this.sequelize.transaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new UnitOfWork(sequelize);
