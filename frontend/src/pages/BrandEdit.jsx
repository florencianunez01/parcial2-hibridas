import { useNavigate, useParams } from "react-router-dom"
import { useFetch } from "../hooks/useFetch.js"
import { getBrand, updateBrand } from "../api/brands.api.js"
import BrandForm from "../components/forms/BrandForm.jsx"
import Loader from "../components/Loader.jsx"
import Alert from "../components/Alert.jsx"

export default function BrandEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: brand, loading, error } = useFetch(() => getBrand(id), [id])

    async function handleSubmit(data) {
        await updateBrand(id, data)
        navigate(`/marcas/${id}`)
    }

    if (loading) return <Loader />
    if (error) return <Alert>{error.message}</Alert>

    return (
        <section className="narrow">
            <h1>Editar marca</h1>
            <BrandForm
                key={id}
                initialValues={{ name: brand.name, photo: brand.photo, description: brand.description }}
                onSubmit={handleSubmit}
                submitLabel="Guardar cambios"
            />
        </section>
    )
}
