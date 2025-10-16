import { type Infer, v } from 'convex/values'
import { mutation, type MutationCtx, query } from './_generated/server'
import { taskDueDate, taskStatus } from './schema'
import { addDays } from 'date-fns'

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('tasks').collect()
  },
})

function createTask(
  ctx: MutationCtx,
  args: { text: string; dueDate?: Infer<typeof taskDueDate> }
) {
  return ctx.db.insert('tasks', {
    ...args,
    status: 'not-started',
  })
}

export const create = mutation({
  args: {
    text: v.string(),
    // TODO: how to validate it is an ISO date
    dueDate: v.optional(taskDueDate),
  },
  handler: async (ctx, args) => {
    const taskId = await createTask(ctx, args)
    return taskId
  },
})

function getNextDueDate(dueDate: Date, repeat: 'weekly' | 'daily' | 'never') {
  if (repeat === 'weekly') {
    return addDays(dueDate, 7)
  } else if (repeat === 'daily') {
    return addDays(dueDate, 1)
  } else {
    return dueDate
  }
}

export const updateStatus = mutation({
  args: {
    id: v.id('tasks'),
    status: taskStatus,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status })
    const task = await ctx.db.get(args.id)
    if (!task) return
    if (
      args.status === 'completed' &&
      task.dueDate &&
      task.dueDate.repeat !== 'never'
    ) {
      const nextDueDate = getNextDueDate(
        new Date(task.dueDate.date),
        task.dueDate.repeat ?? 'never'
      )

      await createTask(ctx, {
        text: task.text,
        dueDate: {
          date: nextDueDate.toISOString(),
          repeat: task.dueDate.repeat,
        },
      })
    }
  },
})
