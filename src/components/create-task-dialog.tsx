import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '../../convex/_generated/api'
import { useMutation } from 'convex/react'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { DatePicker } from './date-picker'
import z from 'zod'

const taskFormSchema = z.object({
  name: z.string(),
  date: z.iso.datetime().optional(),
})

export function CreateTaskDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const createTask = useMutation(api.tasks.create)

  async function handleSubmit(formData: FormData) {
    const data = taskFormSchema.parse({
      ...Object.fromEntries(formData),
      date: formData.get('date') || undefined,
    })
    await createTask({
      text: data.name,
      dueDate: data.date,
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' size='sm'>
          Create
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4'>
            <div className='grid gap-3'>
              <Label htmlFor='name-1'>Name</Label>
              <Input id='name-1' name='name' />
            </div>
            <div className='grid gap-3'>
              <DatePicker label='Due Date' name='date' />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button type='submit'>Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
