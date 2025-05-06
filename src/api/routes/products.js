import { Router } from "express"
import { products } from "../controllers/products/products.js"

const router = Router()

router.get("/", products)

export default router
