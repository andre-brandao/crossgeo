import { db } from '$db'
import {
  mapTable,
  type InsertMap,
  type SelectMap,
  mapPointTable,
  type InsertMapPoint,
  type SelectMapPoint,
  type SelectUser,
  type InsertMapData,
  mapDataTable,
  type InsertChart,
  chartTable,
  type SelectMapData,
  //   type SelectMapGroup,
} from '$db/schema'
import { eq } from 'drizzle-orm'

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

function insertMapData(data: InsertMapData) {
  return db.insert(mapDataTable).values(data)
}

function updateMapData(id: SelectMap['id'], data: Partial<SelectMap>) {
  return db.update(mapTable).set(data).where(eq(mapTable.id, id))
}

function insertChart(data: InsertChart) {
  return db.insert(chartTable).values(data)
}
function updateChart(id: SelectMap['id'], data: Partial<SelectMap>) {
  return db.update(chartTable).set(data).where(eq(chartTable.id, id))
}

function deleteChart(id: SelectMap['id']) {
  return db.delete(chartTable).where(eq(chartTable.id, id))
}

function queryMapWithPoints(id: SelectMap['id']) {
  return db.query.mapTable.findFirst({
    where: t => eq(t.id, id),
    with: {
      made_by: true,
      data: {
        with: {
          charts: true,
          points: true,
        },
      },
    },
  })
}

function getMapDataByID(id: SelectMapData['id']) {
  return db.query.mapDataTable.findFirst({
    where: t => eq(t.id, id),
    with: {
      map: true,
    },
  })
}

function getUserMaps(user_id: SelectUser['id']) {
  return db.query.mapTable.findMany({
    where: t => eq(t.created_by, user_id),
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
  insertMapData,
  updateMapData,
  insertChart,
  updateChart,
  deleteChart,
  getUserMaps,
  getMapByID,
  getMapDataByID,
  queryMapWithPoints,
}
