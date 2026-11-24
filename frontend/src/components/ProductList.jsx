import ProductCard from "./ProductCard.jsx"

export default function ProductList({ products, categories = [], emptyText = "No hay productos para mostrar." }) {
    if (!products.length) return <p className="empty">{emptyText}</p>
    const categoryName = slug => categories.find(c => c.slug === slug)?.name
    return (
        <div className="grid grid--products">
            {products.map(product => (
                <ProductCard key={product._id} product={product} categoryName={categoryName(product.category)} />
            ))}
        </div>
    )
}
