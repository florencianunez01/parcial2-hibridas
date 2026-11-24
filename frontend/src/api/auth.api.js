import { request } from "./client.js"

export const register = data => request("/usuarios", { method: "POST", body: data })
export const login = data => request("/usuarios/login", { method: "POST", body: data })
export const getProfile = () => request("/usuarios/perfil")
export const updateProfile = data => request("/usuarios/perfil", { method: "PATCH", body: data })
