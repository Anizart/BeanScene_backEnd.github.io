import express from 'express';
import addToBasket from '../controllers/addToBasket.js';

const router = express.Router();

router.post('/add-to-basket', addToBasket);

export default router;