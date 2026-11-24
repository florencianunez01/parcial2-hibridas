export default function Loader({ text = "Cargando…" }) {
    return (
        <div className="loader" role="status">
            <span className="loader__dot" />
            {text}
        </div>
    )
}
