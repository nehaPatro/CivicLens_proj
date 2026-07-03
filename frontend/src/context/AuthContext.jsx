import { createContext, useEffect, useState } from 'react'
import * as authService from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('civiclens_token'))
  const [loading, setLoading] = useState(true)

  // On mount, restore session from localStorage and validate with backend
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = localStorage.getItem('civiclens_token')
      const savedUser = localStorage.getItem('civiclens_user')

      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
        // Refresh profile in background to keep counts up to date
        try {
          const freshUser = await authService.getProfile()
          setUser(freshUser)
          localStorage.setItem('civiclens_user', JSON.stringify(freshUser))
        } catch {
          // Token invalid/expired — log out silently
          logout()
        }
      }
      setLoading(false)
    }
    restoreSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persistSession = (data) => {
    localStorage.setItem('civiclens_token', data.access_token)
    localStorage.setItem('civiclens_user', JSON.stringify(data.user))
    setToken(data.access_token)
    setUser(data.user)
  }

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    persistSession(data)
    return data
  }

  const signup = async (name, email, password) => {
    const data = await authService.signup(name, email, password)
    persistSession(data)
    return data
  }

  const loginWithGoogle = async (idToken) => {
    const data = await authService.googleLogin(idToken)
    persistSession(data)
    return data
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('civiclens_user', JSON.stringify(updatedUser))
  }

  const logout = () => {
    localStorage.removeItem('civiclens_token')
    localStorage.removeItem('civiclens_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        signup,
        loginWithGoogle,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
