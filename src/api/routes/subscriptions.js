import { Router } from 'express';
import { subscribeEmail } from '../controllers/subscribes/subscribeEmail.js';

const router = Router();

router.post('/email', subscribeEmail);

export default router;