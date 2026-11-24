import { isObjectId } from "../validations/common.js"

/** Valida req.body con el validador indicado y lo reemplaza por los datos limpios. */
export function validateBody(validator, options = {}) {
    return (req, res, next) => {
        const { data, errors } = validator(req.body ?? {}, options)
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ error: "Datos inválidos", details: errors })
        }
        req.body = data
        next()
    }
}

export function validateIdParam(req, res, next) {
    if (!isObjectId(req.params.id)) {
        return res.status(400).json({ error: "El ID no es válido" })
    }
    next()
}
