import { Fragment } from 'react'
import { Checkbox } from './components/ui/checkbox'
import { Label } from './components/ui/label'
import { Separator } from './components/ui/separator'
import { useTasks } from './TaskProvider'

export function TaskList() {
  const { tasks } = useTasks()
  return (
    <div>
      <Separator />
      {tasks.map((task) => (
        <Fragment key={task._id}>
          <Label className='flex gap-2 items-center p-2'>
            <Checkbox id={task._id} />
            <p>{task.text}</p>
          </Label>
          <Separator />
        </Fragment>
      ))}
    </div>
  )
}
