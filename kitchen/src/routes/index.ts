import { Router, Request, Response } from 'express';
import OrderRouter from './order.route';
import RecipeRouter from './recipe.route';

const router: Router = Router();

router.use('/orders', OrderRouter);
router.use('/recipes', RecipeRouter);
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Service is healthy 🚀',
  });
});
export default router;
