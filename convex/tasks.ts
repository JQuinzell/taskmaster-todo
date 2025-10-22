import { type Infer, v } from 'convex/values'
import { mutation, type MutationCtx, query } from './_generated/server'
import { taskRecurrence, taskStatus } from './schema'
import { addDays } from 'date-fns'
import { type Id } from './_generated/dataModel'

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('tasks').collect()
  },
})

async function createTask(
  ctx: MutationCtx,
  args: {
    text: string
    dueDate?: string
    recurrence?: Infer<typeof taskRecurrence>
    templateId?: Id<'taskTemplates'>
  }
) {
  const { recurrence, ...taskArgs } = args
  // TODO: I really dont like this logic. Need to more neatly handle the condition of creating a template
  let createdTemplateId: Id<'taskTemplates'> | undefined
  if (recurrence) {
    createdTemplateId = await ctx.db.insert('taskTemplates', {
      recurrence: recurrence,
      text: taskArgs.text,
    })
  }
  const templateId = createdTemplateId || args.templateId
  const taskId = await ctx.db.insert('tasks', {
    ...taskArgs,
    status: 'not-started',
    templateId,
  })
  if (templateId) {
    ctx.db.patch(templateId, { activeTask: taskId })
  }
  return taskId
}

export const create = mutation({
  args: {
    text: v.string(),
    // TODO: how to validate it is an ISO date
    dueDate: v.optional(v.string()),
    recurrence: v.optional(taskRecurrence),
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
    // TODO: want a better way to assert this state instead of ignoring null (even if I know it's there)
    const task = (await ctx.db.get(args.id))!
    if (!task.templateId) return
    const template = (await ctx.db.get(task.templateId))!

    // TODO: clean up this condition
    if (
      args.status === 'completed' &&
      task.dueDate &&
      template.recurrence !== 'never' &&
      template.activeTask === task._id
    ) {
      const nextDueDate = getNextDueDate(
        new Date(task.dueDate),
        template.recurrence ?? 'never'
      )

      await createTask(ctx, {
        text: task.text,
        dueDate: nextDueDate.toISOString(),
        templateId: task.templateId,
      })
    }
  },
})
