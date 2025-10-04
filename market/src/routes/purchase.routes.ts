import { PurchaseContoller } from '@/controller/purchase.controller';
import { Router } from 'express';
import Container from 'typedi';

const router = Router();

const purchaseContoller = Container.get(PurchaseContoller);

router.get('/', purchaseContoller.getPurchases.bind(purchaseContoller));

export default router;
