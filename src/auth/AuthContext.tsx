import { createContext, useContext, useState } from 'react'
import z from 'zod'

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
})

type User = z.infer<typeof userSchema>

export type AuthContextValue = {
  user: User | null
  signIn: (user: User) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}

const AUTH_USER_KEY = 'auth-user'

function initializeUser() {
  const storedUser = localStorage.getItem(AUTH_USER_KEY)
  if (!storedUser) {
    return null
  }
  const value = userSchema.safeParse(JSON.parse(storedUser))
  if (value.success) {
    return value.data
  }
  return null
}

export function useAuthProvider(): AuthContextValue {
  const [user, setUser] = useState<User | null>(initializeUser)

  // fake sign in for now
  function signIn(user: User) {
    console.log('Setting user', user)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    setUser(user)
  }

  function signOut() {
    setUser(null)
    localStorage.removeItem(AUTH_USER_KEY)
  }

  const contextValue = {
    user,
    signIn,
    signOut,
  }

  return contextValue
}
