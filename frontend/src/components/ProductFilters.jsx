/** Filtros controlados: el estado vive en la página (en la URL), este componente sólo lo muestra y avisa cambios. */
export default function ProductFilters({ filters, onChange, categories, brands }) {
    const handle = e => onChange({ ...filters, [e.target.name]: e.target.value })

    return (
        <form className="filters" onSubmit={e => e.preventDefault()} role="search">
            <input name="q" type="search" placeholder="Buscar por nombre…" value={filters.q} onChange={handle} aria-label="Buscar por nombre" />
            <select name="category" value={filters.category} onChange={handle} aria-label="Categoría">
                <option value="">Todas las categorías</option>
                {categories.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
            </select>
            <select name="brand_id" value={filters.brand_id} onChange={handle} aria-label="Marca">
                <option value="">Todas las marcas</option>
                {brands.map(b => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                ))}
            </select>
            <input name="ingredient" type="search" placeholder="Ingrediente (ej: niacinamida)" value={filters.ingredient} onChange={handle} aria-label="Ingrediente" />
        </form>
    )
}
