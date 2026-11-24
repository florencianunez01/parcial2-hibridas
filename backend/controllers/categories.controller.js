import { getCategories as listCategories } from "../services/categories.services.js"

// GET /api/categorias
export function getCategories(req, res) {
    res.status(200).json(listCategories())
}
