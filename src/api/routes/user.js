import { Router } from 'express';
import { userProfile } from '../controllers/user/userProfile.js';
import { updateProfile } from "../controllers/user/updateProfile.js";

const router = Router();

router.get('/', userProfile);
router.put('/', updateProfile);

export default router;
