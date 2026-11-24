import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js"
import { useForm } from "../hooks/useForm.js"
import { validateLogin } from "../validations/index.js"
import FormField from "../components/FormField.jsx"
import Alert from "../components/Alert.jsx"

export default function Login() {
    const { login } = useAuth()
    const location = useLocation()

    // Al loguearse, GuestRoute redirige a la página de origen (location.state.from) o al inicio
    const { values, errors, formError, submitting, handleChange, handleSubmit } = useForm(
        { email: "", password: "" },
        validateLogin,
        values => login({ email: values.email.trim(), password: values.password })
    )

    return (
        <section className="auth-card">
            <h1>Ingresar</h1>
            {location.state?.from && <Alert type="info">Iniciá sesión para continuar.</Alert>}
            <form className="form" onSubmit={handleSubmit} noValidate>
                <Alert>{formError}</Alert>
                <FormField label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} />
                <FormField label="Contraseña" name="password" type="password" autoComplete="current-password" value={values.password} onChange={handleChange} error={errors.password} />
                <button className="btn btn--primary btn--block" disabled={submitting}>{submitting ? "Ingresando…" : "Ingresar"}</button>
            </form>
            <p className="muted center">¿No tenés cuenta? <Link to="/registro">Registrate</Link></p>
        </section>
    )
}
