import { useState } from "react"

/** Botón de eliminar con confirmación en dos pasos. onConfirm es async. */
export default function DeleteButton({ onConfirm, label = "Eliminar" }) {
    const [confirming, setConfirming] = useState(false)
    const [busy, setBusy] = useState(false)

    async function handleConfirm() {
        setBusy(true)
        try {
            await onConfirm()
        } finally {
            setBusy(false)
            setConfirming(false)
        }
    }

    if (!confirming) {
        return <button className="btn btn--danger-ghost" onClick={() => setConfirming(true)}>{label}</button>
    }

    return (
        <span className="confirm">
            ¿Seguro?
            <button className="btn btn--danger btn--sm" onClick={handleConfirm} disabled={busy}>
                {busy ? "Eliminando…" : "Sí, eliminar"}
            </button>
            <button className="btn btn--ghost btn--sm" onClick={() => setConfirming(false)} disabled={busy}>Cancelar</button>
        </span>
    )
}
