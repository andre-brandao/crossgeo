import {
  sqliteTable,
  text,
  integer,
  real,
  // customType,
} from 'drizzle-orm/sqlite-core'
import { sql, relations } from 'drizzle-orm'

import { userTable } from '$db/schema'

import { createInsertSchema } from 'drizzle-zod'

// import { z } from 'zod'

export const mapTable = sqliteTable('map', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  name: text('name').notNull(),
  created_by: text('created_by')
    .notNull()
    .references(() => userTable.id),

  lat: real('latitude'), //center lat
  long: real('longitude'), //center long
})

export const mapRelations = relations(mapTable, ({ one, many }) => ({
  made_by: one(userTable, {
    fields: [mapTable.created_by],
    references: [userTable.id],
  }),
  data: many(mapDataTable),
}))

export const insertMapSchema = createInsertSchema(mapTable)
export type SelectMap = typeof mapTable.$inferSelect
export type InsertMap = typeof mapTable.$inferInsert

export type AddressInfo = {
  address_field: string
  fields: string[]
}

export type LatLongInfo = {
  lat_field: string
  long_field: string
  fields: string[]
}

export type FieldsInfo = AddressInfo | LatLongInfo

export const mapDataTable = sqliteTable('map_data', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  map_id: integer('map_id')
    .notNull()
    .references(() => mapTable.id),
  name: text('name'),
  fields_info: text('fields', { mode: 'json' }).notNull().$type<FieldsInfo>(),
})

export const mapDataRelations = relations(mapDataTable, ({ one, many }) => ({
  map: one(mapTable, {
    fields: [mapDataTable.map_id],
    references: [mapTable.id],
  }),
  points: many(mapPointTable),
  charts: many(chartTable),
}))

export const insertMapDataSchema = createInsertSchema(mapDataTable)
export type SelectMapData = typeof mapDataTable.$inferSelect
export type InsertMapData = typeof mapDataTable.$inferInsert

export const mapPointTable = sqliteTable('point', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  data_id: integer('data_id')
    .notNull()
    .references(() => mapDataTable.id, {
      onDelete: 'cascade',
    }),
  lat: real('latitude').notNull(),
  long: real('longitude').notNull(),
  meta_data: text('meta', { mode: 'json' }).$type<Record<string, unknown>>(),
})

export const mapPointRelations = relations(mapPointTable, ({ one }) => ({
  map_data: one(mapDataTable, {
    fields: [mapPointTable.data_id],
    references: [mapDataTable.id],
  }),
}))

export const insertMapPointSchema = createInsertSchema(mapPointTable)

export type SelectMapPoint = typeof mapPointTable.$inferSelect
export type InsertMapPoint = typeof mapPointTable.$inferInsert

import type { Query } from '$lib/components/map/dataset'

export const chartTable = sqliteTable('chart', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  data_id: integer('data_id')
    .notNull()
    .references(() => mapDataTable.id, {
      onDelete: 'cascade',
    }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  filters: text('filters', { mode: 'json' })
    .notNull()
    .$type<{ label: string; query: Query }[]>(),
})

export const chartRelations = relations(chartTable, ({ one }) => ({
  data: one(mapDataTable, {
    fields: [chartTable.data_id],
    references: [mapDataTable.id],
  }),
}))

export const insertChartSchema = createInsertSchema(chartTable, {
  // filters: z
  //   .array(
  //     z.object({
  //       label: z.string(),
  //       query: z.object({
  //         field: z.string(),
  //         value: z.any(),
  //         operator: z.string(),
  //       }),
  //     }),
  //   )
  //   .nonempty(),
})
export type SelectChart = typeof chartTable.$inferSelect
export type InsertChart = typeof chartTable.$inferInsert
