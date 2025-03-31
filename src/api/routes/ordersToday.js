import express from 'express';
import ordersToday from '../controllers/ordersToday.js';

const router = express.Router();

router.get('/orders-today', ordersToday);

export default router;