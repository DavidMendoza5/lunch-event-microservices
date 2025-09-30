import { Router, Request, Response } from 'express';
import OrderRouter from './order.route';

const router: Router = Router();

router.use('/order', OrderRouter);
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Service is healthy 🚀',
  });
});
export default router;
