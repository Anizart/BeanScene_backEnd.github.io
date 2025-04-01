import express from 'express';
import {getBasket} from '../controllers/basket/getBasket.js';
import {addToBasket} from "../controllers/basket/addToBasket.js";
import {removeFromBasket} from "../controllers/basket/removeFromBasket.js";

const router = express.Router();

router.get('/', getBasket);
router.post('/', addToBasket);
router.delete('/', removeFromBasket);

export default router;