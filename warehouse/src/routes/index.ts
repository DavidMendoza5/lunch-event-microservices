import { Router, Request, Response } from 'express';
import ingredientRouter from './ingredient.route';

const router: Router = Router();

router.use('/ingredients', ingredientRouter);
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Service is healthy 🚀',
  });
});
export default router;
