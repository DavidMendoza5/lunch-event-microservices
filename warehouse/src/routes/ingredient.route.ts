import { IngredientController } from '@/controller/ingredient.controller';
import { Router } from 'express';
import Container from 'typedi';

const router = Router();

const ingredientController = Container.get(IngredientController);

router.get('/', ingredientController.getIngredients.bind(ingredientController));

export default router;
