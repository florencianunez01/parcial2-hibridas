import { Link, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { useFetch } from "../hooks/useFetch.js"
import { useAuth } from "../hooks/useAuth.js"
import { deleteProduct, getCategories, getProduct } from "../api/products.api.js"
import { formatPrice } from "../utils/format.js"
import Loader from "../components/Loader.jsx"
import Alert from "../components/Alert.jsx"
import DeleteButton from "../components/DeleteButton.jsx"
import NotFound from "./NotFound.jsx"

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [error, setError] = useState("")
    const { data: product, loading, error: loadError } = useFetch(() => getProduct(id), [id])
    const categories = useFetch(getCategories)

    if (loading) return <Loader />
    if (loadError?.status === 404 || loadError?.status === 400) return <NotFound text="El producto no existe." />
    if (loadError) return <Alert>{loadError.message}</Alert>

    const category = categories.data?.find(c => c.slug === product.category)
    const brand = product.brand_id

    async function handleDelete() {
        try {
            await deleteProduct(id)
            navigate("/productos", { replace: true })
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <article className="detail">
            <img className="detail__img" src={product.img} alt={product.name} />
            <div className="detail__info">
                <Link to="/productos" className="back">← Productos</Link>
                {category && <Link to={`/productos?category=${category.slug}`} className="tag">{category.name}</Link>}
                <h1>{product.name}</h1>
                {brand && <p>de <Link to={`/marcas/${brand._id}`}><strong>{brand.name}</strong></Link></p>}
                <p className="price price--lg">{formatPrice(product.price)}</p>
                <p>{product.description}</p>

                <h2 className="h3">Ingredientes activos</h2>
                <ul className="chips">
                    {product.ingredients.map(i => (
                        <li key={i}><Link to={`/productos?ingredient=${encodeURIComponent(i)}`}>{i}</Link></li>
                    ))}
                </ul>

                <a href={product.link} target="_blank" rel="noreferrer" className="btn btn--ghost">Ver en el sitio de la marca ↗</a>

                {isAuthenticated && (
                    <div className="actions">
                        <Alert>{error}</Alert>
                        <Link to={`/productos/${id}/editar`} className="btn btn--primary">Editar</Link>
                        <DeleteButton onConfirm={handleDelete} />
                    </div>
                )}
            </div>
        </article>
    )
}
