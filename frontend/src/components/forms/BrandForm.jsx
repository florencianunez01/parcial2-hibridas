import { useForm } from "../../hooks/useForm.js"
import { validateBrand } from "../../validations/index.js"
import FormField from "../FormField.jsx"
import Alert from "../Alert.jsx"

const EMPTY = { name: "", photo: "", description: "" }

export default function BrandForm({ initialValues = EMPTY, onSubmit, submitLabel = "Guardar" }) {
    const { values, errors, formError, submitting, handleChange, handleSubmit } = useForm(
        { ...EMPTY, ...initialValues },
        validateBrand,
        values => onSubmit({ name: values.name.trim(), photo: values.photo.trim(), description: values.description.trim() })
    )

    return (
        <form className="form" onSubmit={handleSubmit} noValidate>
            <Alert>{formError}</Alert>
            <FormField label="Nombre" name="name" value={values.name} onChange={handleChange} error={errors.name} maxLength={60} />
            <FormField label="URL de la foto" name="photo" type="url" value={values.photo} onChange={handleChange} error={errors.photo} placeholder="https://…" />
            <FormField label="Descripción" name="description" as="textarea" rows={4} value={values.description} onChange={handleChange} error={errors.description} maxLength={500} />
            <button className="btn btn--primary" disabled={submitting}>{submitting ? "Guardando…" : submitLabel}</button>
        </form>
    )
}
