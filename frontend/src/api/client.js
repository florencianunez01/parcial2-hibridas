// Cliente HTTP base. Toda la comunicación con la API pasa por acá (las vistas no usan fetch).
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333/api"
const TOKEN_KEY = "seoulglow_token"

export const tokenStorage = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: token => localStorage.setItem(TOKEN_KEY, token),
    clear: () => localStorage.removeItem(TOKEN_KEY)
}

/** Error con el código HTTP y el detalle de validación que devuelve la API. */
export class ApiError extends Error {
    constructor(message, status, details = {}) {
        super(message)
        this.status = status
        this.details = details
    }
}

// Se registra desde AuthContext para cerrar sesión cuando el token vence (401).
let onUnauthorized = () => {}
export const setUnauthorizedHandler = fn => {
    onUnauthorized = fn
}

export async function request(path, { method = "GET", body, query } = {}) {
    const url = new URL(API_URL + path)
    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, value)
        })
    }

    const headers = { Accept: "application/json" }
    if (body !== undefined) headers["Content-Type"] = "application/json"
    const token = tokenStorage.get()
    if (token) headers.Authorization = `Bearer ${token}`

    let response
    try {
        response = await fetch(url, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined })
    } catch {
        throw new ApiError("No se pudo conectar con el servidor", 0)
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        if (response.status === 401 && token) onUnauthorized()
        throw new ApiError(data?.error || "Ocurrió un error", response.status, data?.details || {})
    }
    return data
}
