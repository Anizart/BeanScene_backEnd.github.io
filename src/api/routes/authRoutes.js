import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router(); // ????? не то же самое что и app?

router.post('/regist', register); // Почкму можно 2?
router.post('/login', login);

export default router;