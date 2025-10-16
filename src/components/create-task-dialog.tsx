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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const taskFormSchema = z.object({
  name: z.string(),
  date: z.iso.datetime().optional(),
  repeats: z.enum(['weekly', 'daily', 'never']).optional(),
})

export function CreateTaskDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const createTask = useMutation(api.tasks.create)

  async function handleSubmit(formData: FormData) {
    const data = taskFormSchema.parse({
      ...Object.fromEntries(formData),
      date: formData.get('date') || undefined,
    })
    const date = data.date
    await createTask({
      text: data.name,
      dueDate: date
        ? { date: date, repeat: data.repeats ?? 'never' }
        : undefined,
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
              <Label htmlFor='name'>Name</Label>
              <Input id='name' name='name' />
            </div>
            <div className='grid gap-3'>
              <DatePicker label='Due Date' name='date' />
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='repeats'>Repeats</Label>
              <Select name='repeats'>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Never Repeats' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='weekly'>Weekly</SelectItem>
                  <SelectItem value='daily'>Daily</SelectItem>
                  <SelectItem value='never'>Never</SelectItem>
                </SelectContent>
              </Select>
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
