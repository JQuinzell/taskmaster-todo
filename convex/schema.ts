import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const taskStatus = v.union(
  v.literal('not-started'),
  v.literal('completed')
)

export const taskRecurrence = v.union(
  v.literal('weekly'),
  v.literal('daily'),
  v.literal('never')
)

export const task = v.object({
  text: v.string(),
  status: taskStatus,
  // TODO: how to better support dates?
  dueDate: v.optional(v.string()),
  templateId: v.optional(v.id('taskTemplates')),
})

export const taskTemplate = v.object({
  text: v.string(),
  recurrence: v.optional(taskRecurrence),
  activeTask: v.optional(v.id('tasks')),
})

export const user = v.object({
  name: v.string(),
})

export default defineSchema({
  tasks: defineTable(task),
  users: defineTable(user),
  taskTemplates: defineTable(taskTemplate),
})
