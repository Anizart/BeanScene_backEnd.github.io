import express from 'express';
import userProfile from '../controllers/userProfile.js';

const router = express.Router();

router.get('/user-profile', userProfile);

export default router;