/** Campo de formulario con label y mensaje de error. as = "input" | "textarea" | "select". */
export default function FormField({ label, name, error, as = "input", hint, children, ...props }) {
    const Tag = as
    const id = `field-${name}`
    return (
        <div className={`field ${error ? "field--error" : ""}`}>
            <label htmlFor={id}>{label}</label>
            <Tag id={id} name={name} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props}>
                {children}
            </Tag>
            {hint && !error && <small className="field__hint">{hint}</small>}
            {error && <small id={`${id}-error`} className="field__error">{error}</small>}
        </div>
    )
}
