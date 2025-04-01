import { Router } from "express";
import { register, login } from "../controllers/auth/authController.js";
import { checkAuth } from "../controllers/auth/checkAuth.js";
import { logout } from "../controllers/auth/logout.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", checkAuth);
router.get("/logout", logout);

export default router;
