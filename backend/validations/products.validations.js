import { isValidCategory } from "../services/categories.services.js"
import { cleanString, isObjectId, isUrl, runRules, toStringArray } from "./common.js"

const rules = {
    name: value => {
        const v = cleanString(value)
        if (v.length < 3 || v.length > 100) return { error: "El nombre debe tener entre 3 y 100 caracteres" }
        return { value: v }
    },
    description: value => {
        const v = cleanString(value)
        if (v.length < 10 || v.length > 800) return { error: "La descripción debe tener entre 10 y 800 caracteres" }
        return { value: v }
    },
    ingredients: value => {
        const v = toStringArray(value)
        if (v.length === 0) return { error: "Debe indicar al menos un ingrediente activo" }
        return { value: v }
    },
    link: value => {
        const v = cleanString(value)
        if (!isUrl(v)) return { error: "El link debe ser una URL válida (http/https)" }
        return { value: v }
    },
    img: value => {
        const v = cleanString(value)
        if (!isUrl(v)) return { error: "La imagen debe ser una URL válida (http/https)" }
        return { value: v }
    },
    price: value => {
        const v = Number(value)
        if (value === "" || value === null || value === undefined || !Number.isFinite(v) || v < 0) {
            return { error: "El precio debe ser un número mayor o igual a 0" }
        }
        return { value: Math.round(v * 100) / 100 }
    },
    category: value => {
        const v = cleanString(value)
        if (!isValidCategory(v)) return { error: "La categoría no es válida" }
        return { value: v }
    },
    brand_id: value => {
        const v = cleanString(value)
        if (!isObjectId(v)) return { error: "La marca es obligatoria y debe ser un ID válido" }
        return { value: v }
    }
}

export const validateProduct = (body, options) => runRules(rules, body, options)
