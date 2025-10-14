import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const taskStatus = v.union(
  v.literal('not-started'),
  v.literal('completed')
)

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    status: taskStatus,
    // TODO: how to better support dates?
    dueDate: v.optional(v.string()),
  }),
})
