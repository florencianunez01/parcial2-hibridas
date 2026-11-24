import * as productsService from "../services/products.services.js"
import { brandExists } from "../services/brands.services.js"
import { isValidCategory } from "../services/categories.services.js"
import { isObjectId } from "../validations/common.js"

// GET /api/productos?category=serum&ingredient=niacinamida&brand_id=...&q=...
export async function getProducts(req, res) {
    const { category, ingredient, brand_id, q } = req.query

    if (category && !isValidCategory(category)) {
        return res.status(400).json({ error: `La categoría "${category}" no existe` })
    }
    if (brand_id && !isObjectId(brand_id)) {
        return res.status(400).json({ error: "El brand_id no es válido" })
    }

    const products = await productsService.getProducts({ category, ingredient, brand_id, q })
    res.status(200).json(products)
}

// GET /api/productos/:id
export async function getProductById(req, res) {
    const product = await productsService.getProductById(req.params.id)
    if (!product) return res.status(404).json({ error: "Producto no encontrado" })
    res.status(200).json(product)
}

// POST /api/productos
export async function createProduct(req, res) {
    if (!(await brandExists(req.body.brand_id))) {
        return res.status(400).json({ error: "Datos inválidos", details: { brand_id: "La marca indicada no existe" } })
    }
    const product = await productsService.createProduct(req.body, req.user._id)
    res.status(201).json(product)
}

// PUT y PATCH /api/productos/:id
export async function updateProduct(req, res) {
    if (req.body.brand_id && !(await brandExists(req.body.brand_id))) {
        return res.status(400).json({ error: "Datos inválidos", details: { brand_id: "La marca indicada no existe" } })
    }
    const product = await productsService.updateProduct(req.params.id, req.body)
    if (!product) return res.status(404).json({ error: "Producto no encontrado" })
    res.status(200).json(product)
}

// DELETE /api/productos/:id
export async function deleteProduct(req, res) {
    const product = await productsService.deleteProduct(req.params.id)
    if (!product) return res.status(404).json({ error: "Producto no encontrado" })
    res.status(200).json({ message: "Producto eliminado", product })
}
