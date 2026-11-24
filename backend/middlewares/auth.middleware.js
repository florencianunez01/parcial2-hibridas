import { verifyToken } from "../services/auth.services.js"

/** Exige un JWT válido en el header Authorization: Bearer <token>. Deja el usuario en req.user. */
export function requireAuth(req, res, next) {
    const header = req.headers.authorization || ""
    const [type, token] = header.split(" ")

    if (type !== "Bearer" || !token) {
        return res.status(401).json({ error: "Se requiere iniciar sesión" })
    }

    try {
        const payload = verifyToken(token)
        req.user = { _id: payload.sub, name: payload.name, email: payload.email }
        next()
    } catch {
        res.status(401).json({ error: "Token inválido o vencido" })
    }
}
