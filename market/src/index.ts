import app from './app';
import 'reflect-metadata';

import 'dotenv/config';
import serverConfig from './config/server';
import { IngredientPurchaseConsumer } from './events/consumers/ingredient-purchase.consumer';

app.listen(serverConfig.port, () => {
  const ingredientPurchaseConsumer = new IngredientPurchaseConsumer();
  ingredientPurchaseConsumer.consume();
  console.info(`Server up and running on port ${serverConfig.port}`);
});
