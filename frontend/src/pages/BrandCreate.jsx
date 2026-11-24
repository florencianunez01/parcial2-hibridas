import { useNavigate } from "react-router-dom"
import { createBrand } from "../api/brands.api.js"
import BrandForm from "../components/forms/BrandForm.jsx"

export default function BrandCreate() {
    const navigate = useNavigate()

    async function handleSubmit(data) {
        const brand = await createBrand(data)
        navigate(`/marcas/${brand._id}`)
    }

    return (
        <section className="narrow">
            <h1>Nueva marca</h1>
            <BrandForm onSubmit={handleSubmit} submitLabel="Crear marca" />
        </section>
    )
}
