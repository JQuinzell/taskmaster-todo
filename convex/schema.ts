import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const taskStatus = v.union(
  v.literal('not-started'),
  v.literal('completed')
)

export const taskDueDate = v.object({
  date: v.string(),
  repeat: v.optional(
    v.union(v.literal('weekly'), v.literal('daily'), v.literal('never'))
  ),
})

export const task = v.object({
  text: v.string(),
  status: taskStatus,
  // TODO: how to better support dates?
  dueDate: v.optional(taskDueDate),
})

export const user = v.object({
  name: v.string(),
})

export default defineSchema({
  tasks: defineTable(task),
  users: defineTable(user),
})
