import { useForm } from "../../hooks/useForm.js"
import { splitList, validateProduct } from "../../validations/index.js"
import FormField from "../FormField.jsx"
import Alert from "../Alert.jsx"

const EMPTY = { name: "", description: "", ingredients: "", link: "", img: "", price: "", category: "", brand_id: "" }

/** Convierte un producto de la API a los valores del formulario (ingredientes como texto, marca como id). */
export function productToValues(product) {
    return {
        name: product.name,
        description: product.description,
        ingredients: product.ingredients.join(", "),
        link: product.link,
        img: product.img,
        price: String(product.price ?? ""),
        category: product.category,
        brand_id: typeof product.brand_id === "object" ? product.brand_id._id : product.brand_id
    }
}

export default function ProductForm({ initialValues = EMPTY, categories, brands, onSubmit, submitLabel = "Guardar" }) {
    const { values, errors, formError, submitting, handleChange, handleSubmit } = useForm(
        { ...EMPTY, ...initialValues },
        validateProduct,
        values =>
            onSubmit({
                name: values.name.trim(),
                description: values.description.trim(),
                ingredients: splitList(values.ingredients),
                link: values.link.trim(),
                img: values.img.trim(),
                price: Number(values.price),
                category: values.category,
                brand_id: values.brand_id
            })
    )

    return (
        <form className="form" onSubmit={handleSubmit} noValidate>
            <Alert>{formError}</Alert>
            <FormField label="Nombre" name="name" value={values.name} onChange={handleChange} error={errors.name} maxLength={100} />
            <FormField label="Descripción" name="description" as="textarea" rows={4} value={values.description} onChange={handleChange} error={errors.description} maxLength={800} />
            <FormField label="Ingredientes activos" name="ingredients" value={values.ingredients} onChange={handleChange} error={errors.ingredients} hint="Separados por coma. Ej: Niacinamida, Ácido hialurónico" />

            <div className="form__row">
                <FormField label="Categoría" name="category" as="select" value={values.category} onChange={handleChange} error={errors.category}>
                    <option value="">Elegí una categoría</option>
                    {categories.map(c => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                </FormField>
                <FormField label="Marca" name="brand_id" as="select" value={values.brand_id} onChange={handleChange} error={errors.brand_id}>
                    <option value="">Elegí una marca</option>
                    {brands.map(b => (
                        <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                </FormField>
                <FormField label="Precio (ARS)" name="price" type="number" min="0" step="1" value={values.price} onChange={handleChange} error={errors.price} />
            </div>

            <FormField label="URL de la imagen" name="img" type="url" value={values.img} onChange={handleChange} error={errors.img} placeholder="https://…" />
            <FormField label="Link de compra / info" name="link" type="url" value={values.link} onChange={handleChange} error={errors.link} placeholder="https://…" />

            <button className="btn btn--primary" disabled={submitting}>{submitting ? "Guardando…" : submitLabel}</button>
        </form>
    )
}
