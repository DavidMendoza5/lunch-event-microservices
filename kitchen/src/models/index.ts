import { Sequelize } from 'sequelize-typescript';
import serverConfig from '@config/server';
import databaseConfig from '@config/database';
import OrderModel from './order.model';
import IngredientModel from './ingredient.model';
import RecipeModel from './recipe.model';
import RecipeIngredientModel from './recipe-ingredient.model';
import OrderDishModel from './order-dishes.model';

const env = serverConfig.environment || 'development';

const dbConfig = databaseConfig[env];

const sequelizeConfig = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'mysql',
    models: [
      OrderModel,
      IngredientModel,
      RecipeModel,
      RecipeIngredientModel,
      OrderDishModel,
    ],
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
