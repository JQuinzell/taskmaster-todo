import { api } from '../convex/_generated/api'
import type { Doc } from '../convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { createContext, useContext, useMemo } from 'react'

type Task = Doc<'tasks'>

type TaskContext = {
  tasks: Task[]
}

const Context = createContext<TaskContext | null>(null)

export function useTasks() {
  const context = useContext(Context)

  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider.')
  }

  return context
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const tasks = useQuery(api.tasks.get)

  const contextValue = useMemo(() => ({ tasks: tasks ?? [] }), [tasks])

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
