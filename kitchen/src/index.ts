import app from './app';
import 'reflect-metadata';
import 'dotenv/config';

import serverConfig from './config/server';
import { IngredientConsumer } from './events/consumers/ingredient.consumer';
import { OrderUpdatedConsumer } from './events/consumers/order-updated.consumer';

app.listen(serverConfig.port, async () => {
  const ingredientConsumer = new IngredientConsumer();
  await ingredientConsumer.consume();
  const orderConsumer = new OrderUpdatedConsumer();
  orderConsumer.consume();
  console.info(`Server up and running on port ${serverConfig.port}`);
});
