// Validaciones del lado del cliente (mismas reglas que el backend).
const isUrl = value => {
    try {
        const url = new URL(value)
        return url.protocol === "http:" || url.protocol === "https:"
    } catch {
        return false
    }
}
const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
const len = value => String(value ?? "").trim().length

export const splitList = value =>
    [...new Set(String(value ?? "").split(",").map(s => s.trim()).filter(Boolean))]

export function validateLogin({ email, password }) {
    const errors = {}
    if (!isEmail(email.trim())) errors.email = "Ingresá un email válido"
    if (!password) errors.password = "Ingresá tu contraseña"
    return errors
}

export function validateRegister({ name, email, password, confirm }) {
    const errors = {}
    if (len(name) < 2 || len(name) > 60) errors.name = "El nombre debe tener entre 2 y 60 caracteres"
    if (!isEmail(email.trim())) errors.email = "Ingresá un email válido"
    if (password.length < 6) errors.password = "La contraseña debe tener al menos 6 caracteres"
    else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) errors.password = "La contraseña debe tener letras y números"
    if (confirm !== password) errors.confirm = "Las contraseñas no coinciden"
    return errors
}

export function validateProfile({ name }) {
    const errors = {}
    if (len(name) < 2 || len(name) > 60) errors.name = "El nombre debe tener entre 2 y 60 caracteres"
    return errors
}

export function validateBrand({ name, photo, description }) {
    const errors = {}
    if (len(name) < 2 || len(name) > 60) errors.name = "El nombre debe tener entre 2 y 60 caracteres"
    if (!isUrl(photo.trim())) errors.photo = "La foto debe ser una URL válida (http/https)"
    if (len(description) < 10 || len(description) > 500) errors.description = "La descripción debe tener entre 10 y 500 caracteres"
    return errors
}

export function validateProduct(values) {
    const errors = {}
    if (len(values.name) < 3 || len(values.name) > 100) errors.name = "El nombre debe tener entre 3 y 100 caracteres"
    if (len(values.description) < 10 || len(values.description) > 800) errors.description = "La descripción debe tener entre 10 y 800 caracteres"
    if (splitList(values.ingredients).length === 0) errors.ingredients = "Indicá al menos un ingrediente (separados por coma)"
    if (!isUrl(values.link.trim())) errors.link = "El link debe ser una URL válida (http/https)"
    if (!isUrl(values.img.trim())) errors.img = "La imagen debe ser una URL válida (http/https)"
    const price = Number(values.price)
    if (values.price === "" || !Number.isFinite(price) || price < 0) errors.price = "El precio debe ser un número mayor o igual a 0"
    if (!values.category) errors.category = "Elegí una categoría"
    if (!values.brand_id) errors.brand_id = "Elegí una marca"
    return errors
}
