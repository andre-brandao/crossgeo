import { db } from '$db'
import {
  mapTable,
  type InsertMap,
  type SelectMap,
  mapPointTable,
  type InsertMapPoint,
  type SelectMapPoint,
  mapGroupTable,
  groupToUserTable,
  type SelectUser,
//   type SelectMapGroup,
  type InsertMapGroup,
  type InsertGroupToUser,
} from '$db/schema'
import { eq } from 'drizzle-orm'

function insertPoint(data: InsertMapPoint) {
  return db.insert(mapPointTable).values(data)
}

function updatePoints(id: SelectMapPoint['id'], data: Partial<SelectMapPoint>) {
  return db.update(mapPointTable).set(data).where(eq(mapPointTable.id, id))
}

function insertMap(data: InsertMap) {
  return db.insert(mapTable).values(data)
}

function updateMap(id: SelectMap['id'], data: Partial<SelectMap>) {
  return db.update(mapTable).set(data).where(eq(mapTable.id, id))
}

function insertGroup(data: InsertMapGroup) {
  return db.insert(mapGroupTable).values(data)
}

function addUserToGroup(data: InsertGroupToUser) {
  return db.insert(groupToUserTable).values(data)
}

function queryMapWithPoints(id: SelectMap['id']) {
  return db.query.mapTable.findFirst({
    where: t => eq(t.id, id),
    with: {
      points: true,
    },
  })
}

function queryUserGroupsWithMaps(id: SelectUser['id']) {
  return db.query.groupToUserTable.findMany({
    where: t => eq(t.user_id, id),
    with: {
      group: {
        with: {
          maps: true,
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

function getMapByID(map_id: SelectMap['id']){
  return db.query.mapTable.findFirst({
    where: t => eq(t.id, map_id)
  })
}

export const map = {
  insertGroup,
  addUserToGroup,
  insertPoint,
  updatePoints,
  insertMap,
  updateMap,
  getUserMaps,
  getMapByID,
  queryMapWithPoints,
   queryUserGroupsWithMaps,
}
