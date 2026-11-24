import { Link } from "react-router-dom"
import { useFetch } from "../hooks/useFetch.js"
import { useAuth } from "../hooks/useAuth.js"
import { getBrands } from "../api/brands.api.js"
import BrandCard from "../components/BrandCard.jsx"
import Loader from "../components/Loader.jsx"
import Alert from "../components/Alert.jsx"

export default function Brands() {
    const { isAuthenticated } = useAuth()
    const { data: brands, loading, error } = useFetch(getBrands)

    return (
        <>
            <div className="page-head">
                <h1>Marcas</h1>
                {isAuthenticated && <Link to="/marcas/nueva" className="btn btn--primary">+ Nueva marca</Link>}
            </div>
            {loading ? <Loader /> : error ? <Alert>{error.message}</Alert> : brands.length === 0 ? (
                <p className="empty">Todavía no hay marcas.</p>
            ) : (
                <div className="grid grid--brands">
                    {brands.map(brand => <BrandCard key={brand._id} brand={brand} />)}
                </div>
            )}
        </>
    )
}
