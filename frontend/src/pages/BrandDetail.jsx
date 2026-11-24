import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useFetch } from "../hooks/useFetch.js"
import { useAuth } from "../hooks/useAuth.js"
import { deleteBrand, getBrand, getBrandProducts } from "../api/brands.api.js"
import { getCategories } from "../api/products.api.js"
import ProductList from "../components/ProductList.jsx"
import DeleteButton from "../components/DeleteButton.jsx"
import Loader from "../components/Loader.jsx"
import Alert from "../components/Alert.jsx"
import NotFound from "./NotFound.jsx"

export default function BrandDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [error, setError] = useState("")

    const brand = useFetch(() => getBrand(id), [id])
    const products = useFetch(() => getBrandProducts(id), [id])
    const categories = useFetch(getCategories)

    if (brand.loading) return <Loader />
    if (brand.error?.status === 404 || brand.error?.status === 400) return <NotFound text="La marca no existe." />
    if (brand.error) return <Alert>{brand.error.message}</Alert>

    async function handleDelete() {
        try {
            await deleteBrand(id)
            navigate("/marcas", { replace: true })
        } catch (err) {
            setError(err.message)
        }
    }

    const { name, photo, description } = brand.data
    const productCount = products.data?.length ?? 0

    return (
        <>
            <Link to="/marcas" className="back">← Marcas</Link>
            <header className="brand-head">
                <img src={photo} alt="" className="brand-head__photo" />
                <div>
                    <h1>{name}</h1>
                    <p>{description}</p>
                    {isAuthenticated && (
                        <div className="actions">
                            <Link to={`/marcas/${id}/editar`} className="btn btn--primary">Editar</Link>
                            <Link to={`/productos/nuevo?marca=${id}`} className="btn btn--ghost">+ Producto de {name}</Link>
                            {productCount === 0 && <DeleteButton onConfirm={handleDelete} label="Eliminar marca" />}
                        </div>
                    )}
                    {isAuthenticated && productCount > 0 && (
                        <p className="muted small">Para eliminar la marca primero hay que eliminar o mover sus productos.</p>
                    )}
                    <Alert>{error}</Alert>
                </div>
            </header>

            <section className="section">
                <h2>Productos ({productCount})</h2>
                {products.loading ? <Loader /> : (
                    <ProductList products={products.data || []} categories={categories.data || []} emptyText="Esta marca todavía no tiene productos." />
                )}
            </section>
        </>
    )
}
