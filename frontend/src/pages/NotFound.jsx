import { Link } from "react-router-dom"

export default function NotFound({ text = "La página que buscás no existe." }) {
    return (
        <section className="not-found">
            <h1>404</h1>
            <p>{text}</p>
            <Link to="/" className="btn btn--primary">Volver al inicio</Link>
        </section>
    )
}
