import { RecipeController } from '@/controllers/recipe.controller';
import { Router } from 'express';
import Container from 'typedi';

const router = Router();

const recipeController = Container.get(RecipeController);

router.get('/', recipeController.getDishes.bind(recipeController));

export default router;
