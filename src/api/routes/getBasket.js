import express from 'express';
import getBasket from '../controllers/getBasket.js';

const router = express.Router();

router.get('/get-basket', getBasket);

export default router;