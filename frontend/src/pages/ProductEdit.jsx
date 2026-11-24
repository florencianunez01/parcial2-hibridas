import { useNavigate, useParams } from "react-router-dom"
import { useFetch } from "../hooks/useFetch.js"
import { getCategories, getProduct, updateProduct } from "../api/products.api.js"
import { getBrands } from "../api/brands.api.js"
import ProductForm, { productToValues } from "../components/forms/ProductForm.jsx"
import Loader from "../components/Loader.jsx"
import Alert from "../components/Alert.jsx"

export default function ProductEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const product = useFetch(() => getProduct(id), [id])
    const categories = useFetch(getCategories)
    const brands = useFetch(getBrands)

    async function handleSubmit(data) {
        await updateProduct(id, data)
        navigate(`/productos/${id}`)
    }

    if (product.loading || categories.loading || brands.loading) return <Loader />
    if (product.error) return <Alert>{product.error.message}</Alert>

    return (
        <section className="narrow">
            <h1>Editar producto</h1>
            <ProductForm
                key={id}
                initialValues={productToValues(product.data)}
                categories={categories.data || []}
                brands={brands.data || []}
                onSubmit={handleSubmit}
                submitLabel="Guardar cambios"
            />
        </section>
    )
}
