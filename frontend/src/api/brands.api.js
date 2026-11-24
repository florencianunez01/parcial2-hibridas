import { request } from "./client.js"

export const getBrands = (query = {}) => request("/marcas", { query })
export const getBrand = id => request(`/marcas/${id}`)
export const getBrandProducts = id => request(`/marcas/${id}/productos`)
export const createBrand = data => request("/marcas", { method: "POST", body: data })
export const updateBrand = (id, data) => request(`/marcas/${id}`, { method: "PUT", body: data })
export const deleteBrand = id => request(`/marcas/${id}`, { method: "DELETE" })
