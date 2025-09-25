import app from './app';
import 'reflect-metadata';

import 'dotenv/config';
import serverConfig from './config/server';
import { OrderConsumer } from './events/consumers/order.consumer';

app.listen(serverConfig.port, async () => {
  const orderConsumer = new OrderConsumer();
  await orderConsumer.consume();
  console.info(`Server up and running on port ${serverConfig.port}`);
});
