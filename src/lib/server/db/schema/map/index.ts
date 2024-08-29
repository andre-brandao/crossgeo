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
  map_data: many(mapDataTable),
}))

export const insertMapSchema = createInsertSchema(mapTable)
export type SelectMap = typeof mapTable.$inferSelect
export type InsertMap = typeof mapTable.$inferInsert

export const mapDataTable = sqliteTable(
  'map_data',
  {
    map_id: integer('map_id')
      .notNull()
      .references(() => mapTable.id, {
        onDelete: 'cascade',
      }),
    data_id: integer('data_id')
      .notNull()
      .references(() => dataTable.id, {
        onDelete: 'cascade',
      }),
  },
  t => ({
    pk: primaryKey({ columns: [t.map_id, t.data_id] }),
  }),
)
export type SelectMapData = typeof mapDataTable.$inferSelect
export type InsertMapData = typeof mapDataTable.$inferInsert

export const mapDataRelations = relations(mapDataTable, ({ one }) => ({
  map: one(mapTable, {
    fields: [mapDataTable.map_id],
    references: [mapTable.id],
  }),
  data: one(dataTable, {
    fields: [mapDataTable.data_id],
    references: [dataTable.id],
  }),
}))

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

export const dataTable = sqliteTable('data', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  created_by: text('created_by')
    .notNull()
    .references(() => userTable.id),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  name: text('name'),
  fields_info: text('fields', { mode: 'json' }).notNull().$type<FieldsInfo>(),
})

export const dataRelations = relations(dataTable, ({ one, many }) => ({
  made_by: one(userTable, {
    fields: [dataTable.created_by],
    references: [userTable.id],
  }),
  points: many(mapPointTable),
  charts: many(chartTable),
  map_data: many(mapDataTable),
}))

export const insertDataSchema = createInsertSchema(dataTable)
export type SelectData = typeof dataTable.$inferSelect
export type InsertData = typeof dataTable.$inferInsert

export const mapPointTable = sqliteTable('point', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  data_id: integer('data_id')
    .notNull()
    .references(() => dataTable.id, {
      onDelete: 'cascade',
    }),
  lat: real('latitude').notNull(),
  long: real('longitude').notNull(),
  meta_data: text('meta', { mode: 'json' }).$type<Record<string, unknown>>(),
})

export const mapPointRelations = relations(mapPointTable, ({ one }) => ({
  map_data: one(dataTable, {
    fields: [mapPointTable.data_id],
    references: [dataTable.id],
  }),
}))

export const insertMapPointSchema = createInsertSchema(mapPointTable)

export type SelectMapPoint = typeof mapPointTable.$inferSelect
export type InsertMapPoint = typeof mapPointTable.$inferInsert

import type { Query } from '$lib/components/map/dataset'

export const chartTable = sqliteTable('chart', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  created_by : text('created_by').notNull().references(() => userTable.id),
  data_id: integer('data_id')
    .notNull()
    .references(() => dataTable.id, {
      onDelete: 'cascade',
    }),
  type: text('type').notNull(),
  title: text('title').notNull(),
  filters: text('filters', { mode: 'json' })
    .notNull()
    .$type<{ label: string; query: Query }[]>(),
})

export const chartRelations = relations(chartTable, ({ one }) => ({
  data: one(dataTable, {
    fields: [chartTable.data_id],
    references: [dataTable.id],
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
