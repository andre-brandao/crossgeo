import { db } from '$db'
import {
  mapTable,
  type InsertMap,
  type SelectMap,
  mapPointTable,
  type InsertMapPoint,
  type SelectMapPoint,
  type SelectUser,
  type InsertData,
  dataTable,
  type InsertChart,
  chartTable,
  type SelectData,
  mapDataTable,
  // type SelectMapData,
  // type InsertMapData,
  //   type SelectMapGroup,
} from '$db/schema'

import { type User } from 'lucia'
import { and, count, eq } from 'drizzle-orm'

function insertPoints(data: InsertMapPoint | InsertMapPoint[]) {
  if (Array.isArray(data)) {
    return db.insert(mapPointTable).values(data)
  }
  return db.insert(mapPointTable).values(data)
}

function updatePoint(id: SelectMapPoint['id'], data: Partial<SelectMapPoint>) {
  return db.update(mapPointTable).set(data).where(eq(mapPointTable.id, id))
}

function insertMap(data: InsertMap) {
  return db.insert(mapTable).values(data)
}

function updateMap(id: SelectMap['id'], data: Partial<SelectMap>) {
  return db.update(mapTable).set(data).where(eq(mapTable.id, id))
}

function insertData(data: InsertData) {
  return db.insert(dataTable).values(data)
}

function updateData(id: SelectMap['id'], data: Partial<SelectMap>) {
  return db.update(mapTable).set(data).where(eq(mapTable.id, id))
}

function insertChart(data: InsertChart) {
  return db.insert(chartTable).values(data).returning()
}
function updateChart(id: SelectMap['id'], data: Partial<SelectMap>) {
  return db.update(chartTable).set(data).where(eq(chartTable.id, id))
}

function deleteChart(id: SelectMap['id']) {
  return db.delete(chartTable).where(eq(chartTable.id, id))
}

function addDataToMap(map_id: SelectMap['id'], data_id: SelectData['id']) {
  return db.insert(mapDataTable).values({ map_id, data_id })
}

function removeDataFromMap(map_id: SelectMap['id'], data_id: SelectData['id']) {
  return db
    .delete(mapDataTable)
    .where(
      and(eq(mapDataTable.map_id, map_id), eq(mapDataTable.data_id, data_id)),
    )
}

function queryMapWithPoints(id: SelectMap['id']) {
  return db.query.mapTable.findFirst({
    where: t => eq(t.id, id),
    with: {
      made_by: true,
      map_data: {
        with: {
          data: {
            with: {
              charts: true,
              points: true,
            },
          },
        },
      },
    },
  })
}

function getUserMaps(user_id: SelectUser['id']) {
  return db.query.mapTable.findMany({
    where: t => eq(t.created_by, user_id),
  })
}
function countUserMaps(user_id: SelectUser['id']) {
  return db
    .select({ count: count() })
    .from(mapTable)
    .where(eq(mapTable.created_by, user_id))
}
function countUserDatasets(user_id: SelectUser['id']) {
  return db
    .select({ count: count() })
    .from(dataTable)
    .where(eq(dataTable.created_by, user_id))
}
function getUserData(user_id: SelectUser['id']) {
  return db.query.dataTable.findMany({
    where: t => eq(t.created_by, user_id),
  })
}

function getDataById(data_id: SelectData['id']) {
  return db.query.dataTable.findFirst({
    where: t => eq(t.id, data_id),
  })
}

function getDataWithPointsById(data_id: SelectData['id']) {
  return db.query.dataTable.findFirst({
    where: t => eq(t.id, data_id),
    // TODO: Limit made by select
    with: {points : true, made_by : true}
  })
}

function getOnePointFromData(id: SelectData['id']) {
  return db.query.mapPointTable.findFirst({
    where: t => eq(t.data_id, id),
  })
}
function getMapByID(map_id: SelectMap['id']) {
  return db.query.mapTable.findFirst({
    where: t => eq(t.id, map_id),
  })
}

async function canUserAccessMap(map_id: SelectMap['id'], user: User | null) {
  const map = await getMapByID(map_id)
  if (!map) return false
  return map.created_by === user?.id
}

async function canUserAccessData(data_id: SelectData['id'], user: User | null) {
  const data = await getDataById(data_id)
  if (!data) return false
  return data.created_by === user?.id
}
async function canUserAccessChart(
  chart_id: SelectData['id'],
  user: User | null,
) {
  const chart = await db.query.chartTable.findFirst({
    where: t => eq(t.id, chart_id),
  })
  if (!chart) return false
  return chart.created_by === user?.id
}
export const map = {
  insertPoints,
  updatePoint,
  insertMap,
  canUserAccessMap,
  canUserAccessData,
  canUserAccessChart,
  updateMap,
  insertData,
  updateData,
  insertChart,
  updateChart,
  deleteChart,
  getUserMaps,
  getMapByID,
  getDataById,
  getOnePointFromData,
  getUserData,
  addDataToMap,
  removeDataFromMap,
  queryMapWithPoints,
  countUserMaps,
  countUserDatasets,
  getDataWithPointsById,

  getPublicData: db
    .select()
    .from(dataTable)
    .where(eq(dataTable.created_by, 'vjrq1xz47vwhbxc')),
}
