import { cleanString, isUrl, runRules } from "./common.js"

const rules = {
    name: value => {
        const v = cleanString(value)
        if (v.length < 2 || v.length > 60) return { error: "El nombre debe tener entre 2 y 60 caracteres" }
        return { value: v }
    },
    photo: value => {
        const v = cleanString(value)
        if (!isUrl(v)) return { error: "La foto debe ser una URL válida (http/https)" }
        return { value: v }
    },
    description: value => {
        const v = cleanString(value)
        if (v.length < 10 || v.length > 500) return { error: "La descripción debe tener entre 10 y 500 caracteres" }
        return { value: v }
    }
}

export const validateBrand = (body, options) => runRules(rules, body, options)
