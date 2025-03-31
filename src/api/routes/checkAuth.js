import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.get('/check-auth', checkAuth);

export default router;

//? Получается, если метод get, то обращаюсь к /models, если post в /controllers?