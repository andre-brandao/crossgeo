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
import { and, eq } from 'drizzle-orm'

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

function getMapByID(map_id: SelectMap['id']) {
  return db.query.mapTable.findFirst({
    where: t => eq(t.id, map_id),
  })
}

export const map = {
  insertPoints,
  updatePoint,
  insertMap,
  updateMap,
  insertData,
   updateData,
  insertChart,
  updateChart,
  deleteChart,
  getUserMaps,
  getMapByID,
  getDataById,
  getUserData,
  addDataToMap,
  removeDataFromMap,
  queryMapWithPoints,
}
