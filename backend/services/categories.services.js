// Categorías (pasos de la rutina). Nombre visible + slug que se guarda en cada producto.
const CATEGORIES = [
    { name: "Limpiadores", slug: "limpiador" },
    { name: "Tónicos", slug: "tonico" },
    { name: "Sérums y esencias", slug: "serum" },
    { name: "Hidratantes", slug: "hidratante" },
    { name: "Protectores solares", slug: "protector-solar" }
]

export const CATEGORY_SLUGS = CATEGORIES.map(c => c.slug)

export function getCategories() {
    return CATEGORIES
}

export function isValidCategory(slug) {
    return CATEGORY_SLUGS.includes(slug)
}
