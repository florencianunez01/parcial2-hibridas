import { Brand } from "../models/brand.model.js"
import { Product } from "../models/product.model.js"

export function escapeRegex(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function getBrands({ q } = {}) {
    const filter = q ? { name: { $regex: escapeRegex(q), $options: "i" } } : {}
    return Brand.find(filter).sort({ name: 1 }).lean()
}

export function getBrandById(id) {
    return Brand.findById(id).lean()
}

export async function brandExists(id) {
    return Boolean(await Brand.exists({ _id: id }))
}

export async function createBrand(data, userId) {
    const brand = await Brand.create({ ...data, created_by: userId })
    return brand.toObject()
}

/** PUT (todos los campos) y PATCH (sólo los enviados). */
export function updateBrand(id, data) {
    return Brand.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).lean()
}

export function countProducts(id) {
    return Product.countDocuments({ brand_id: id })
}

export function deleteBrand(id) {
    return Brand.findByIdAndDelete(id).lean()
}
