import { useState } from "react"
import { useAuth } from "../hooks/useAuth.js"
import { useForm } from "../hooks/useForm.js"
import { validateProfile } from "../validations/index.js"
import FormField from "../components/FormField.jsx"
import Alert from "../components/Alert.jsx"

export default function Profile() {
    const { user, updateProfile } = useAuth()
    const [saved, setSaved] = useState(false)

    const { values, errors, formError, submitting, handleChange, handleSubmit } = useForm(
        { name: user.name },
        validateProfile,
        async values => {
            setSaved(false)
            await updateProfile({ name: values.name.trim() })
            setSaved(true)
        }
    )

    const since = new Date(user.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })

    return (
        <section className="auth-card">
            <h1>Mi perfil</h1>
            <p className="muted">{user.email} · miembro desde el {since}</p>
            <form className="form" onSubmit={handleSubmit} noValidate>
                <Alert>{formError}</Alert>
                {saved && <Alert type="success">Perfil actualizado.</Alert>}
                <FormField label="Nombre" name="name" value={values.name} onChange={handleChange} error={errors.name} />
                <button className="btn btn--primary" disabled={submitting}>{submitting ? "Guardando…" : "Guardar"}</button>
            </form>
        </section>
    )
}
