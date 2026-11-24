export const isObjectId = value => typeof value === "string" && /^[a-f\d]{24}$/i.test(value)

export function isUrl(value) {
    try {
        const url = new URL(value)
        return url.protocol === "http:" || url.protocol === "https:"
    } catch {
        return false
    }
}

export const cleanString = value => (typeof value === "string" ? value.trim() : "")

export const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)

/** Acepta un array o un string separado por comas ("BHA, Té verde") y devuelve un array limpio. */
export function toStringArray(value) {
    const list = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : []
    return [...new Set(list.map(cleanString).filter(Boolean))]
}

/**
 * Corre un conjunto de reglas { campo: fn(valor) => { value } | { error } }.
 * partial = true -> sólo valida los campos presentes (PATCH).
 * Los campos que no están en las reglas se descartan.
 */
export function runRules(rules, body = {}, { partial = false } = {}) {
    const data = {}
    const errors = {}
    const fields = Object.keys(rules)

    for (const field of fields) {
        if (partial && body[field] === undefined) continue
        const result = rules[field](body[field])
        if (result.error) errors[field] = result.error
        else data[field] = result.value
    }

    if (partial && Object.keys(data).length === 0 && Object.keys(errors).length === 0) {
        errors.body = `Debe enviar al menos uno de estos campos: ${fields.join(", ")}`
    }

    return { data, errors }
}
