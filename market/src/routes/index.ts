import { Router, Request, Response } from 'express';
import PurchaseRouter from './purchase.routes';

const router: Router = Router();

router.use('/purchases', PurchaseRouter);
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Service is healthy 🚀',
  });
});
export default router;
