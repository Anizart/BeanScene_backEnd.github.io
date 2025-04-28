import { Router } from "express";
import { getAllReviews } from "../controllers/reviews/reviews.js";

const router = Router();

router.get("/", getAllReviews);

export default router;