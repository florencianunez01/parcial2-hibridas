import { Router } from "express"
import * as controller from "../controllers/users.controller.js"
import { validateBody } from "../middlewares/validate.middleware.js"
import { requireAuth } from "../middlewares/auth.middleware.js"
import { validateLogin, validateProfile, validateRegister } from "../validations/users.validations.js"

const router = Router()

router.post("/", validateBody(validateRegister), controller.register)
router.post("/login", validateBody(validateLogin), controller.login)
router.get("/perfil", requireAuth, controller.getProfile)
router.patch("/perfil", requireAuth, validateBody(validateProfile), controller.updateProfile)

export default router
