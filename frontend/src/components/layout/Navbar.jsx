import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth.js"

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        setOpen(false)
        navigate("/")
    }

    const close = () => setOpen(false)

    return (
        <header className="navbar">
            <div className="container navbar__inner">
                <Link to="/" className="brand-logo" onClick={close}>
                    Seoul <span>Glow</span>
                </Link>

                <button className="navbar__toggle" aria-label="Abrir menú" aria-expanded={open} onClick={() => setOpen(o => !o)}>
                    ☰
                </button>

                <nav className={`navbar__links ${open ? "is-open" : ""}`}>
                    <NavLink to="/productos" onClick={close}>Productos</NavLink>
                    <NavLink to="/marcas" onClick={close}>Marcas</NavLink>
                    {isAuthenticated ? (
                        <>
                            <NavLink to="/perfil" onClick={close}>Hola, {user.name.split(" ")[0]}</NavLink>
                            <button className="btn btn--ghost btn--sm" onClick={handleLogout}>Salir</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" onClick={close}>Ingresar</NavLink>
                            <Link to="/registro" className="btn btn--primary btn--sm" onClick={close}>Crear cuenta</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
