import express from 'express';
import searchProducts from '../controllers/searchProducts.js';

const router = express.Router();

router.get('/search-products', searchProducts);

export default router;