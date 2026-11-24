import { Link } from "react-router-dom"
import { useFetch } from "../hooks/useFetch.js"
import { getCategories, getProducts } from "../api/products.api.js"
import ProductList from "../components/ProductList.jsx"
import Loader from "../components/Loader.jsx"

const STEP_ICONS = { limpiador: "🫧", tonico: "💧", serum: "✨", hidratante: "🧴", "protector-solar": "☀️" }

export default function Home() {
    const categories = useFetch(getCategories)
    const latest = useFetch(() => getProducts())

    return (
        <>
            <section className="hero">
                <p className="eyebrow">Skin care coreano</p>
                <h1>Armá tu rutina paso a paso</h1>
                <p className="hero__lead">
                    Explorá productos por paso de la rutina, conocé las marcas y, con tu cuenta, sumá o editá el catálogo.
                </p>
                <div className="hero__actions">
                    <Link to="/productos" className="btn btn--primary">Ver productos</Link>
                    <Link to="/marcas" className="btn btn--ghost">Conocer marcas</Link>
                </div>
            </section>

            <section className="section">
                <h2>Los 5 pasos</h2>
                {categories.loading ? (
                    <Loader />
                ) : (
                    <ol className="steps">
                        {(categories.data || []).map((c, i) => (
                            <li key={c.slug}>
                                <Link to={`/productos?category=${c.slug}`} className="step">
                                    <span className="step__icon" aria-hidden="true">{STEP_ICONS[c.slug]}</span>
                                    <span className="step__num">Paso {i + 1}</span>
                                    <strong>{c.name}</strong>
                                </Link>
                            </li>
                        ))}
                    </ol>
                )}
            </section>

            <section className="section">
                <div className="section__head">
                    <h2>Últimos agregados</h2>
                    <Link to="/productos">Ver todos →</Link>
                </div>
                {latest.loading ? <Loader /> : latest.error ? <p className="empty">{latest.error.message}</p> : (
                    <ProductList products={(latest.data || []).slice(0, 4)} categories={categories.data || []} />
                )}
            </section>
        </>
    )
}
