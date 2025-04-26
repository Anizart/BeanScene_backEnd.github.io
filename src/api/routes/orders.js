import { Router } from 'express';
import {createOrder} from "../controllers/orders/createOrder.js";
import {ordersToday} from "../controllers/orders/ordersToday.js";

const router = Router();

router.post('/', createOrder);
router.get('/today', ordersToday);

export default router;