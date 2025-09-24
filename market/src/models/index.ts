import { Sequelize } from 'sequelize-typescript';
import serverConfig from '@config/server';
import databaseConfig from '@config/database';
import PurchaseModel from './purchase.model';

const env = serverConfig.environment || 'development';

const dbConfig = databaseConfig[env];

const sequelizeConfig = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'mysql',
    models: [PurchaseModel],
    logging: false,
    pool: {
      max: 90,
      min: 2,
      acquire: 30000,
      idle: 60000,
    },
  },
);

export default sequelizeConfig;
