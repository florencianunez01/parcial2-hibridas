import { useState } from "react"
import { ApiError } from "../api/client.js"

/**
 * Maneja valores, errores por campo y envío de un formulario.
 * validate(values) devuelve { campo: mensaje } (vacío si está todo bien).
 * onSubmit(values) es async; si la API responde con details, se muestran en cada campo.
 */
export function useForm(initialValues, validate, onSubmit) {
    const [values, setValues] = useState(initialValues)
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState("")
    const [submitting, setSubmitting] = useState(false)

    function handleChange(event) {
        const { name, value } = event.target
        setValues(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setFormError("")

        const found = validate(values)
        setErrors(found)
        if (Object.keys(found).length > 0) return

        setSubmitting(true)
        try {
            await onSubmit(values)
        } catch (err) {
            if (err instanceof ApiError && Object.keys(err.details).length > 0) setErrors(err.details)
            setFormError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return { values, setValues, errors, formError, submitting, handleChange, handleSubmit }
}
