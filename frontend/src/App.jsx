import { Route, Routes } from "react-router-dom"
import Layout from "./components/layout/Layout.jsx"
import { GuestRoute, ProtectedRoute } from "./components/ProtectedRoute.jsx"
import Home from "./pages/Home.jsx"
import Products from "./pages/Products.jsx"
import ProductDetail from "./pages/ProductDetail.jsx"
import ProductCreate from "./pages/ProductCreate.jsx"
import ProductEdit from "./pages/ProductEdit.jsx"
import Brands from "./pages/Brands.jsx"
import BrandDetail from "./pages/BrandDetail.jsx"
import BrandCreate from "./pages/BrandCreate.jsx"
import BrandEdit from "./pages/BrandEdit.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Profile from "./pages/Profile.jsx"
import NotFound from "./pages/NotFound.jsx"

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                {/* Públicas */}
                <Route index element={<Home />} />
                <Route path="productos" element={<Products />} />
                <Route path="productos/:id" element={<ProductDetail />} />
                <Route path="marcas" element={<Brands />} />
                <Route path="marcas/:id" element={<BrandDetail />} />

                {/* Sólo visitantes */}
                <Route element={<GuestRoute />}>
                    <Route path="login" element={<Login />} />
                    <Route path="registro" element={<Register />} />
                </Route>

                {/* Requieren sesión (JWT) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="productos/nuevo" element={<ProductCreate />} />
                    <Route path="productos/:id/editar" element={<ProductEdit />} />
                    <Route path="marcas/nueva" element={<BrandCreate />} />
                    <Route path="marcas/:id/editar" element={<BrandEdit />} />
                    <Route path="perfil" element={<Profile />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}
