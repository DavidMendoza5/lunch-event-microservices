import { OrderController } from '@/controllers/order.controller';
import { Router } from 'express';
import Container from 'typedi';

const router = Router();

const orderController = Container.get(OrderController);

router.post('/', orderController.createOrder.bind(orderController));
router.get('/', orderController.getOrdersWithRecipes.bind(orderController));

export default router;
