'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const recipes = [
      { name: 'Tacos', updated_at: new Date() },
      { name: 'Huevos motuleños', updated_at: new Date() },
      { name: 'Pozole', updated_at: new Date() },
      { name: 'Frijol con puerco', updated_at: new Date() },
      { name: 'Pescado frito', updated_at: new Date() },
      { name: 'Pollo a la plancha', updated_at: new Date() },
    ];
    await queryInterface.bulkInsert('recipes', recipes);

    const recipesCreated = await queryInterface.sequelize.query(
      `SELECT id, name FROM recipes WHERE name IN (:names)`,
      {
        replacements: { names: recipes.map(i => i.name) },
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const ingredients = await queryInterface.sequelize.query(
      `SELECT id, name FROM ingredients`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const recipeIngredients = [];
    const now = new Date();

    for (const recipe of recipesCreated) {
      const shuffled = [...ingredients].sort(() => 0.5 - Math.random());

      const selected = shuffled.slice(0, Math.max(2, Math.floor(Math.random() * 4)));

      for (const ingredient of selected) {
        recipeIngredients.push({
          recipe_id: recipe.id,
          ingredient_id: ingredient.id,
          qty: Math.floor(Math.random() * 3) + 1,
          updated_at: now,
        });
      }
    }
    await queryInterface.bulkInsert('recipe_ingredients', recipeIngredients);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('recipe_ingredients', null, {});
    await queryInterface.bulkDelete('recipes', null, {});
  }
};
