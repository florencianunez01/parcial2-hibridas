import { useCallback, useEffect, useState } from "react"

/**
 * Ejecuta una función async (de la capa api/) y expone { data, loading, error, reload }.
 * Se vuelve a ejecutar cuando cambian las dependencias.
 */
export function useFetch(fetcher, deps = []) {
    const [state, setState] = useState({ data: null, loading: true, error: null })
    const [version, setVersion] = useState(0)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const run = useCallback(fetcher, deps)

    useEffect(() => {
        let cancelled = false
        setState(prev => ({ ...prev, loading: true, error: null }))
        run()
            .then(data => !cancelled && setState({ data, loading: false, error: null }))
            .catch(error => !cancelled && setState({ data: null, loading: false, error }))
        return () => {
            cancelled = true
        }
    }, [run, version])

    const reload = useCallback(() => setVersion(v => v + 1), [])

    return { ...state, reload }
}
