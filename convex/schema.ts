import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    status: v.union(v.literal('not-started'), v.literal('completed')),
  }),
})
