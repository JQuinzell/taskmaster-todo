import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import './App.css'

function App() {
  const tasks = useQuery(api.tasks.get)

  return tasks?.map((task) => (
    <div key={task._id}>
      <p>{task.text}</p>
      <p>{task.status}</p>
    </div>
  ))
}

export default App
