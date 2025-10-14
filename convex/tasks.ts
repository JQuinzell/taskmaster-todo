import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { taskStatus } from './schema'

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('tasks').collect()
  },
})

export const create = mutation({
  args: {
    text: v.string(),
    // TODO: how to validate it is an ISO date
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert('tasks', {
      ...args,
      status: 'not-started',
    })
    return taskId
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id('tasks'),
    status: taskStatus,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status })
  },
})
