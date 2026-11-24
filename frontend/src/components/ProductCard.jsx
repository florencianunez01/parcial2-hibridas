import { Link } from "react-router-dom"
import { formatPrice } from "../utils/format.js"

export default function ProductCard({ product, categoryName }) {
    const brand = product.brand_id && typeof product.brand_id === "object" ? product.brand_id : null
    return (
        <article className="card product-card">
            <Link to={`/productos/${product._id}`} className="product-card__img">
                <img src={product.img} alt={product.name} loading="lazy" />
            </Link>
            <div className="card__body">
                {categoryName && <span className="tag">{categoryName}</span>}
                <h3 className="card__title">
                    <Link to={`/productos/${product._id}`}>{product.name}</Link>
                </h3>
                {brand && <p className="muted">{brand.name}</p>}
                <p className="price">{formatPrice(product.price)}</p>
            </div>
        </article>
    )
}
