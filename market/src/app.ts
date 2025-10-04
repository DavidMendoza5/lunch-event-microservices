import express, { Application } from 'express';
import cors from 'cors';
import sequelizeConfig from '@models/index';
import errorHandler from '@middlewares/errorHandler.middleware';
import serverConfig from './config/server';
import router from './routes';

const app: Application = express();

sequelizeConfig
  .authenticate()
  .then(() => console.info('Database connected'))
  .catch((error: unknown) => {
    console.error('Error connecting database: ', error);
  });

const corsOptions = {
  origin: serverConfig.origin,
  allowedHeaders: [
    'Authorization',
    'Content-Type',
    'Accept',
    'Origin',
    'X-Requested-With',
    'authorizationtoken',
    'Ip',
    'api-key',
    'x-api-key',
  ],
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS', 'PUT'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use('/api', router);
app.use(errorHandler);

export default app;
