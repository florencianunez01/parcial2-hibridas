import { useNavigate, useSearchParams } from "react-router-dom"
import { useFetch } from "../hooks/useFetch.js"
import { createProduct, getCategories } from "../api/products.api.js"
import { getBrands } from "../api/brands.api.js"
import ProductForm from "../components/forms/ProductForm.jsx"
import Loader from "../components/Loader.jsx"

export default function ProductCreate() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const categories = useFetch(getCategories)
    const brands = useFetch(getBrands)

    async function handleSubmit(data) {
        const product = await createProduct(data)
        navigate(`/productos/${product._id}`)
    }

    if (categories.loading || brands.loading) return <Loader />

    return (
        <section className="narrow">
            <h1>Nuevo producto</h1>
            <ProductForm
                categories={categories.data || []}
                brands={brands.data || []}
                initialValues={{ brand_id: searchParams.get("marca") || "" }}
                onSubmit={handleSubmit}
                submitLabel="Crear producto"
            />
        </section>
    )
}
