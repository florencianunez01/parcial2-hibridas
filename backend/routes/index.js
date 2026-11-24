import { Router } from "express"
import usersRoutes from "./users.routes.js"
import brandsRoutes from "./brands.routes.js"
import productsRoutes from "./products.routes.js"
import { getCategories } from "../controllers/categories.controller.js"

const router = Router()

router.use("/usuarios", usersRoutes)
router.use("/marcas", brandsRoutes)
router.use("/productos", productsRoutes)
router.get("/categorias", getCategories)

export default router
