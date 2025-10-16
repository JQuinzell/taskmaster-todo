import { Fragment } from 'react'
import { Checkbox } from './components/ui/checkbox'
import { Label } from './components/ui/label'
import { Separator } from './components/ui/separator'
import { useTasks } from './TaskProvider'
import { useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'
import { Badge } from './components/ui/badge'
import { intlFormatDistance } from 'date-fns'

export function TaskList() {
  const { tasks } = useTasks()
  const updateTaskStatus = useMutation(api.tasks.updateStatus)

  return (
    <div>
      <Separator />
      {tasks.map((task) => (
        <Fragment key={task._id}>
          <div className='flex gap-2 items-center p-2'>
            <Checkbox
              id={task._id}
              checked={task.status === 'completed'}
              onClick={() =>
                updateTaskStatus({
                  id: task._id,
                  status:
                    task.status === 'completed' ? 'not-started' : 'completed',
                })
              }
            />
            <Label htmlFor={task._id}>
              <p>{task.text}</p>
            </Label>
            {task.dueDate && (
              <Badge variant='secondary' className='ml-auto'>
                {intlFormatDistance(task.dueDate.date, new Date())}
              </Badge>
            )}
          </div>
          <Separator />
        </Fragment>
      ))}
    </div>
  )
}
