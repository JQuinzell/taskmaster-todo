import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import '../index.css'
import type { AuthContextValue } from '@/auth/AuthContext'

const RootLayout = () => {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
}

export const Route = createRootRouteWithContext<{
  authUser: AuthContextValue['user'] | null
}>()({
  component: RootLayout,
})
