import { cleanString, isEmail, runRules } from "./common.js"

const name = value => {
    const v = cleanString(value)
    if (v.length < 2 || v.length > 60) return { error: "El nombre debe tener entre 2 y 60 caracteres" }
    return { value: v }
}

const email = value => {
    const v = cleanString(value).toLowerCase()
    if (!isEmail(v)) return { error: "El email no es válido" }
    return { value: v }
}

const strongPassword = value => {
    const v = typeof value === "string" ? value : ""
    if (v.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres" }
    if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return { error: "La contraseña debe tener letras y números" }
    return { value: v }
}

const anyPassword = value => {
    const v = typeof value === "string" ? value : ""
    if (!v) return { error: "La contraseña es obligatoria" }
    return { value: v }
}

export const validateRegister = body => runRules({ name, email, password: strongPassword }, body)
export const validateLogin = body => runRules({ email, password: anyPassword }, body)
export const validateProfile = body => runRules({ name }, body, { partial: true })
