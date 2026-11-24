import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useFetch } from "../hooks/useFetch.js"
import { useAuth } from "../hooks/useAuth.js"
import { getCategories, getProducts } from "../api/products.api.js"
import { getBrands } from "../api/brands.api.js"
import ProductFilters from "../components/ProductFilters.jsx"
import ProductList from "../components/ProductList.jsx"
import Loader from "../components/Loader.jsx"
import Alert from "../components/Alert.jsx"

const FILTER_KEYS = ["q", "category", "brand_id", "ingredient"]

export default function Products() {
    const { isAuthenticated } = useAuth()
    const [searchParams, setSearchParams] = useSearchParams()

    // Los filtros viven en la URL (se pueden compartir y sobreviven al recargar)
    const filters = Object.fromEntries(FILTER_KEYS.map(k => [k, searchParams.get(k) || ""]))

    // Los campos de texto se aplican con un pequeño retraso para no pedir a la API en cada tecla
    const [draft, setDraft] = useState(filters)
    const key = searchParams.toString()
    useEffect(() => setDraft(Object.fromEntries(FILTER_KEYS.map(k => [k, searchParams.get(k) || ""]))), [key]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const timer = setTimeout(() => {
            const next = Object.fromEntries(Object.entries(draft).filter(([, v]) => v))
            if (new URLSearchParams(next).toString() !== key) setSearchParams(next, { replace: true })
        }, 300)
        return () => clearTimeout(timer)
    }, [draft]) // eslint-disable-line react-hooks/exhaustive-deps

    const categories = useFetch(getCategories)
    const brands = useFetch(getBrands)
    const products = useFetch(() => getProducts(filters), [key])

    const hasFilters = FILTER_KEYS.some(k => filters[k])

    return (
        <>
            <div className="page-head">
                <div>
                    <h1>Productos</h1>
                    <p className="muted">{products.data ? `${products.data.length} resultado(s)` : " "}</p>
                </div>
                {isAuthenticated && <Link to="/productos/nuevo" className="btn btn--primary">+ Nuevo producto</Link>}
            </div>

            <ProductFilters filters={draft} onChange={setDraft} categories={categories.data || []} brands={brands.data || []} />
            {hasFilters && (
                <button className="link-button" onClick={() => setSearchParams({})}>Limpiar filtros</button>
            )}

            {products.loading ? (
                <Loader />
            ) : products.error ? (
                <Alert>{products.error.message}</Alert>
            ) : (
                <ProductList products={products.data} categories={categories.data || []} emptyText="No encontramos productos con esos filtros." />
            )}
        </>
    )
}
