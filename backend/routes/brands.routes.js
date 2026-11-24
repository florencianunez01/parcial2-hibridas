import { Router } from "express"
import * as controller from "../controllers/brands.controller.js"
import { validateBody, validateIdParam } from "../middlewares/validate.middleware.js"
import { requireAuth } from "../middlewares/auth.middleware.js"
import { validateBrand } from "../validations/brands.validations.js"

const router = Router()

// Lectura pública
router.get("/", controller.getBrands)
router.get("/:id", validateIdParam, controller.getBrandById)
router.get("/:id/productos", validateIdParam, controller.getBrandProducts)

// Escritura: requiere JWT
router.post("/", requireAuth, validateBody(validateBrand), controller.createBrand)
router.put("/:id", requireAuth, validateIdParam, validateBody(validateBrand), controller.updateBrand)
router.patch("/:id", requireAuth, validateIdParam, validateBody(validateBrand, { partial: true }), controller.updateBrand)
router.delete("/:id", requireAuth, validateIdParam, controller.deleteBrand)

export default router
