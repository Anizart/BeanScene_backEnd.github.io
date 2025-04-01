import { Router } from "express";
import { products } from "../controllers/products/products.js";
import { getOneProduct } from "../controllers/products/searchProducts.js";

const router = Router();

router.get("/", products);
router.get("/:id", getOneProduct);

export default router;
