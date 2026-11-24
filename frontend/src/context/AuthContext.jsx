import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import * as authApi from "../api/auth.api.js"
import { setUnauthorizedHandler, tokenStorage } from "../api/client.js"

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    // Si hay un token guardado, lo validamos contra la API antes de mostrar rutas privadas
    const [loading, setLoading] = useState(Boolean(tokenStorage.get()))

    const logout = useCallback(() => {
        tokenStorage.clear()
        setUser(null)
    }, [])

    const saveSession = useCallback(({ user, token }) => {
        tokenStorage.set(token)
        setUser(user)
        return user
    }, [])

    useEffect(() => {
        setUnauthorizedHandler(logout)
        if (!tokenStorage.get()) return

        authApi
            .getProfile()
            .then(setUser)
            .catch(logout)
            .finally(() => setLoading(false))
    }, [logout])

    const login = useCallback(async credentials => saveSession(await authApi.login(credentials)), [saveSession])
    const register = useCallback(async data => saveSession(await authApi.register(data)), [saveSession])
    const updateProfile = useCallback(async data => saveSession(await authApi.updateProfile(data)), [saveSession])

    const value = useMemo(
        () => ({ user, isAuthenticated: Boolean(user), loading, login, register, logout, updateProfile }),
        [user, loading, login, register, logout, updateProfile]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
