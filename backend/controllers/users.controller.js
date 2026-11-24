import * as authService from "../services/auth.services.js"

// Express 5 envía automáticamente al errorHandler los errores de funciones async.

// POST /api/usuarios  (registro)
export async function register(req, res) {
    const result = await authService.register(req.body)
    res.status(201).json(result)
}

// POST /api/usuarios/login
export async function login(req, res) {
    const result = await authService.login(req.body)
    res.status(200).json(result)
}

// GET /api/usuarios/perfil
export async function getProfile(req, res) {
    const user = await authService.getProfile(req.user._id)
    res.status(200).json(user)
}

// PATCH /api/usuarios/perfil
export async function updateProfile(req, res) {
    const result = await authService.updateProfile(req.user._id, req.body)
    res.status(200).json(result)
}
