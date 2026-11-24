/** Crea un error con código HTTP para lanzarlo desde servicios o controladores. */
export function httpError(status, message) {
    const err = new Error(message)
    err.status = status
    return err
}

export function notFound(req, res) {
    res.status(404).json({ error: "Endpoint no encontrado" })
}

/** Manejo centralizado de errores (JSON mal formado, errores de Mongoose, errores HTTP propios). */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "JSON inválido" })
    }
    if (err.name === "ValidationError") {
        const details = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]))
        return res.status(400).json({ error: "Datos inválidos", details })
    }
    if (err.name === "CastError") {
        return res.status(400).json({ error: `Valor inválido para ${err.path}` })
    }
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "campo"
        return res.status(409).json({ error: `Ya existe un registro con ese ${field}`, details: { [field]: "Ya está en uso" } })
    }
    if (err.status) {
        return res.status(err.status).json({ error: err.message })
    }
    console.error(err)
    res.status(500).json({ error: "Error interno del servidor" })
}
