import { request } from "./client.js"

export const getProducts = (query = {}) => request("/productos", { query })
export const getProduct = id => request(`/productos/${id}`)
export const createProduct = data => request("/productos", { method: "POST", body: data })
export const updateProduct = (id, data) => request(`/productos/${id}`, { method: "PUT", body: data })
export const deleteProduct = id => request(`/productos/${id}`, { method: "DELETE" })

export const getCategories = () => request("/categorias")
