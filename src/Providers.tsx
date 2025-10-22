import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { useAuthProvider } from './auth/AuthContext'
import { AuthProvider } from './auth/AuthProvider'
import { routeTree } from './routeTree.gen'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ThemeProvider } from './components/theme-provider'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const router = createRouter({
  routeTree,
  context: {
    authUser: null,
  },
})

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

export function Providers() {
  const auth = useAuthProvider()

  return (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <AuthProvider value={auth}>
        <ConvexProvider client={convex}>
          <RouterProvider router={router} context={{ authUser: auth.user }} />
        </ConvexProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
