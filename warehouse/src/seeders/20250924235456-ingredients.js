'use strict';
const RabbitMQ = require('../events/connection.ts').default;

const exchange = 'warehouse.ingredients';

async function publish(event) {
  const rabbit = await RabbitMQ.getInstance();
  const channel = rabbit.getChannel();

  await channel.assertExchange(exchange, 'fanout', { durable: true });
  channel.publish(exchange, '', Buffer.from(JSON.stringify(event)));

  console.log('📢 Ingredient event published:', event);
}

module.exports = {
  async up(queryInterface) {
    const ingredients = [
      { name: 'tomato', stock: 5, updated_at: new Date() },
      { name: 'lemon', stock: 5, updated_at: new Date() },
      { name: 'potato', stock: 5, updated_at: new Date() },
      { name: 'rice', stock: 5, updated_at: new Date() },
      { name: 'ketchup', stock: 5, updated_at: new Date() },
      { name: 'lettuce', stock: 5, updated_at: new Date() },
      { name: 'onion', stock: 5, updated_at: new Date() },
      { name: 'cheese', stock: 5, updated_at: new Date() },
      { name: 'meat', stock: 5, updated_at: new Date() },
      { name: 'chicken', stock: 5, updated_at: new Date() },
    ];
    await queryInterface.bulkInsert('ingredients', ingredients);

    const rows = await queryInterface.sequelize.query(
      `SELECT id, name, stock, updated_at FROM ingredients WHERE name IN (:names)`,
      {
        replacements: { names: ingredients.map(i => i.name) },
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    for (const ing of rows) {
      await publish({ type: "IngredientCreated", data: ing });
    }

    const rabbit = await RabbitMQ.getInstance();
    await rabbit.close();
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ingredients', null, {});
  },
};
