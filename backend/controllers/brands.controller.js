import * as brandsService from "../services/brands.services.js"
import { getProductsByBrand } from "../services/products.services.js"

// GET /api/marcas?q=
export async function getBrands(req, res) {
    const brands = await brandsService.getBrands({ q: req.query.q })
    res.status(200).json(brands)
}

// GET /api/marcas/:id
export async function getBrandById(req, res) {
    const brand = await brandsService.getBrandById(req.params.id)
    if (!brand) return res.status(404).json({ error: "Marca no encontrada" })
    res.status(200).json(brand)
}

// GET /api/marcas/:id/productos
export async function getBrandProducts(req, res) {
    const brand = await brandsService.getBrandById(req.params.id)
    if (!brand) return res.status(404).json({ error: "Marca no encontrada" })
    const products = await getProductsByBrand(req.params.id)
    res.status(200).json(products) // [] si la marca todavía no tiene productos
}

// POST /api/marcas
export async function createBrand(req, res) {
    const brand = await brandsService.createBrand(req.body, req.user._id)
    res.status(201).json(brand)
}

// PUT y PATCH /api/marcas/:id
export async function updateBrand(req, res) {
    const brand = await brandsService.updateBrand(req.params.id, req.body)
    if (!brand) return res.status(404).json({ error: "Marca no encontrada" })
    res.status(200).json(brand)
}

// DELETE /api/marcas/:id  (no se permite si tiene productos asociados)
export async function deleteBrand(req, res) {
    const total = await brandsService.countProducts(req.params.id)
    if (total > 0) {
        return res.status(409).json({ error: `No se puede eliminar: la marca tiene ${total} producto(s) asociados` })
    }
    const brand = await brandsService.deleteBrand(req.params.id)
    if (!brand) return res.status(404).json({ error: "Marca no encontrada" })
    res.status(200).json({ message: "Marca eliminada", brand })
}
