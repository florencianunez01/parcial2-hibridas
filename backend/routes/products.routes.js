import { Router } from "express"
import * as controller from "../controllers/products.controller.js"
import { validateBody, validateIdParam } from "../middlewares/validate.middleware.js"
import { requireAuth } from "../middlewares/auth.middleware.js"
import { validateProduct } from "../validations/products.validations.js"

const router = Router()

// Lectura pública
router.get("/", controller.getProducts)
router.get("/:id", validateIdParam, controller.getProductById)

// Escritura: requiere JWT
router.post("/", requireAuth, validateBody(validateProduct), controller.createProduct)
router.put("/:id", requireAuth, validateIdParam, validateBody(validateProduct), controller.updateProduct)
router.patch("/:id", requireAuth, validateIdParam, validateBody(validateProduct, { partial: true }), controller.updateProduct)
router.delete("/:id", requireAuth, validateIdParam, controller.deleteProduct)

export default router
