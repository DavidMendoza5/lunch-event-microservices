import { Router } from 'express';
import OrderRouter from './order.route';

const router: Router = Router();

router.use('/order', OrderRouter);

export default router;
