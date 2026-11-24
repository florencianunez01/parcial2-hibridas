import { Product } from "../models/product.model.js"
import { escapeRegex } from "./brands.services.js"

const BRAND_FIELDS = "name photo"

/** Filtros soportados: category, ingredient, brand_id, q (búsqueda por nombre). */
function buildFilter({ category, ingredient, brand_id, q } = {}) {
    const filter = {}
    if (category) filter.category = category
    if (brand_id) filter.brand_id = brand_id
    if (ingredient) filter.ingredients = { $regex: escapeRegex(ingredient), $options: "i" }
    if (q) filter.name = { $regex: escapeRegex(q), $options: "i" }
    return filter
}

export function getProducts(query = {}) {
    return Product.find(buildFilter(query)).sort({ createdAt: -1 }).populate("brand_id", BRAND_FIELDS).lean()
}

export function getProductById(id) {
    return Product.findById(id).populate("brand_id", BRAND_FIELDS).lean()
}

export function getProductsByBrand(brandId) {
    return Product.find({ brand_id: brandId }).sort({ createdAt: -1 }).lean()
}

export async function createProduct(data, userId) {
    const product = await Product.create({ ...data, created_by: userId })
    return getProductById(product._id)
}

export function updateProduct(id, data) {
    return Product.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
        .populate("brand_id", BRAND_FIELDS)
        .lean()
}

export function deleteProduct(id) {
    return Product.findByIdAndDelete(id).lean()
}
