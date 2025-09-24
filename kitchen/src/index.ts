import app from './app';
import 'reflect-metadata';
import 'dotenv/config';

import serverConfig from './config/server';

app.listen(serverConfig.port, () =>
  console.info(`Server up and running on port ${serverConfig.port}`),
);
