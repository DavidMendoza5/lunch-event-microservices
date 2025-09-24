import express, { Application } from 'express';
import sequelizeConfig from '@models/index';
import errorHandler from '@/middlewares/error-handler.middleware';

const app: Application = express();

sequelizeConfig
  .authenticate()
  .then(() => console.info('Database connected'))
  .catch((error: unknown) => {
    console.error('Error connecting database: ', error);
  });

app.use(express.json({ limit: '10mb' }));

app.use(errorHandler);

export default app;
