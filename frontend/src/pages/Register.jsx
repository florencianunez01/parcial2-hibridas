import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js"
import { useForm } from "../hooks/useForm.js"
import { validateRegister } from "../validations/index.js"
import FormField from "../components/FormField.jsx"
import Alert from "../components/Alert.jsx"

export default function Register() {
    const { register } = useAuth()
    // Al registrarse queda logueado y GuestRoute redirige al inicio
    const { values, errors, formError, submitting, handleChange, handleSubmit } = useForm(
        { name: "", email: "", password: "", confirm: "" },
        validateRegister,
        values => register({ name: values.name.trim(), email: values.email.trim(), password: values.password })
    )

    return (
        <section className="auth-card">
            <h1>Crear cuenta</h1>
            <form className="form" onSubmit={handleSubmit} noValidate>
                <Alert>{formError}</Alert>
                <FormField label="Nombre" name="name" autoComplete="name" value={values.name} onChange={handleChange} error={errors.name} />
                <FormField label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} />
                <FormField label="Contraseña" name="password" type="password" autoComplete="new-password" value={values.password} onChange={handleChange} error={errors.password} hint="Mínimo 6 caracteres, con letras y números" />
                <FormField label="Repetir contraseña" name="confirm" type="password" autoComplete="new-password" value={values.confirm} onChange={handleChange} error={errors.confirm} />
                <button className="btn btn--primary btn--block" disabled={submitting}>{submitting ? "Creando…" : "Crear cuenta"}</button>
            </form>
            <p className="muted center">¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></p>
        </section>
    )
}
