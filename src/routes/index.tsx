import App from '@/App'
import { TaskList } from '@/TaskList'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
  beforeLoad({ context }) {
    if (!context.authUser) {
      console.log('Redirecting to login')
      throw redirect({ to: '/login' })
    }
  },
})

function Index() {
  return (
    <App>
      <TaskList />
    </App>
  )
}
