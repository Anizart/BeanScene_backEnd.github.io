import express from 'express';
import removeFromBasket from '../controllers/removeFromBasket.js';

const router = express.Router();

router.delete('/remove-from-basket', removeFromBasket);

export default router;