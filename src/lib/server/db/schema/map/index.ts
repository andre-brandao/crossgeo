import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
  // customType,
} from 'drizzle-orm/sqlite-core'
import { sql, relations } from 'drizzle-orm'

import { userTable } from '$db/schema'

import { createInsertSchema } from 'drizzle-zod'

export const mapGroupTable = sqliteTable('group', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  name: text('name').notNull(),
})
export const mapGroupRelations = relations(mapGroupTable, ({ many }) => ({
  users: many(userTable),

  maps: many(mapTable),
}))

export const insertMapGroupSchema = createInsertSchema(mapGroupTable)

export type SelectMapGroup = typeof mapGroupTable.$inferSelect
export type InsertMapGroup = typeof mapGroupTable.$inferInsert

export const groupToUserTable = sqliteTable(
  'user_group',
  {
    user_id: text('user_id')
      .notNull()
      .references(() => userTable.id),
    group_id: integer('group_id')
      .notNull()
      .references(() => mapGroupTable.id),
  },
  t => ({
    pk: primaryKey({ columns: [t.group_id, t.user_id] }),
  }),
)

export const groupToUserRelations = relations(groupToUserTable, ({ one }) => ({
  user: one(userTable, {
    fields: [groupToUserTable.user_id],
    references: [userTable.id],
  }),
  group: one(mapGroupTable, {
    fields: [groupToUserTable.group_id],
    references: [mapGroupTable.id],
  }),
}))

export const insertGroupToUserSchema = createInsertSchema(groupToUserTable)
export type SelectGroupToUser = typeof groupToUserTable.$inferSelect
export type InsertGroupToUser = typeof groupToUserTable.$inferInsert

export const mapTable = sqliteTable('map', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  name: text('name').notNull(),
  created_by: text('created_by')
    .notNull()
    .references(() => userTable.id),
  group_id: integer('group_id').references(() => mapGroupTable.id),

  fields_info: text('fields', { mode: 'json' }).notNull().$type<{
    address_field: string
    fields: string[]
  }>(),
  lat: real('latitude'),
  long: real('longitude'),
})

export const mapRelations = relations(mapTable, ({ one, many }) => ({
  made_by: one(userTable, {
    fields: [mapTable.created_by],
    references: [userTable.id],
  }),
  group: one(mapGroupTable, {
    fields: [mapTable.group_id],
    references: [mapGroupTable.id],
  }),
  points: many(mapPointTable),
}))

export const insertMapSchema = createInsertSchema(mapTable)
export type SelectMap = typeof mapTable.$inferSelect
export type InsertMap = typeof mapTable.$inferInsert

export const mapPointTable = sqliteTable('point', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  map_id: integer('map_id')
    .notNull()
    .references(() => mapTable.id, {
      onDelete: 'cascade',
    }),
  lat: real('latitude').notNull(),
  long: real('longitude').notNull(),
  meta_data: text('meta', { mode: 'json' }).$type<Record<string, unknown>>(),
})

export const mapPointRelations = relations(mapPointTable, ({ one }) => ({
  map: one(mapTable, {
    fields: [mapPointTable.map_id],
    references: [mapTable.id],
  }),
}))

export const insertMapPointSchema = createInsertSchema(mapPointTable)

export type SelectMapPoint = typeof mapPointTable.$inferSelect
export type InsertMapPoint = typeof mapPointTable.$inferInsert
