import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js"
import Loader from "./Loader.jsx"

/** Rutas que requieren sesión. Si no hay usuario, redirige al login y después vuelve. */
export function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) return <Loader />
    if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
    return <Outlet />
}

/** Rutas sólo para visitantes (login/registro). */
export function GuestRoute() {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()
    if (loading) return <Loader />
    // Al iniciar sesión vuelve a la página protegida que se quería abrir
    if (isAuthenticated) return <Navigate to={location.state?.from || "/"} replace />
    return <Outlet />
}
