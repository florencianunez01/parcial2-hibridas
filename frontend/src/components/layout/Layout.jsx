import { Outlet } from "react-router-dom"
import Navbar from "./Navbar.jsx"

export default function Layout() {
    return (
        <>
            <Navbar />
            <main className="container main">
                <Outlet />
            </main>
            <footer className="footer">
                <div className="container">Seoul Glow · Parcial 2 Aplicaciones Híbridas · Escuela Da Vinci</div>
            </footer>
        </>
    )
}
