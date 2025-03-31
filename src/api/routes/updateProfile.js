import express from 'express';
import userProfile from '../controllers/userProfile.js';

const router = express.Router();

router.put('/update-profile', userProfile);

export default router;