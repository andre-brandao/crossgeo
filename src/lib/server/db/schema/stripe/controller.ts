import { db } from '$db'

import { userTable } from '$db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { stripeCheckoutSessionTable, type InsertCheckoutSession } from '.'

async function processStripeOrder(sessionId: string) {
  const [sessionDB] = await getStripeOrderFromID(sessionId)
  if (!sessionDB) {
    return
  }

  if (sessionDB.credited) {
    return
  }

  await db.update(userTable).set({
    max_credits: sql`${userTable.max_credits} + ${sessionDB.geopoints}`,
  })
  await db.update(stripeCheckoutSessionTable).set({
    credited: true,
  })
}

function insertCheckoutSession(session: InsertCheckoutSession) {
  return db.insert(stripeCheckoutSessionTable).values(session)
}

function getStripeOrderFromID(sessionId: string) {
  return db
    .select()
    .from(stripeCheckoutSessionTable)
    .where(eq(stripeCheckoutSessionTable.id, sessionId))
    .limit(1)
}

function getPendingCheckoutSessionFromUserID(userId: string) {
  return db
    .select()
    .from(stripeCheckoutSessionTable)
    .where(
      and(
        eq(stripeCheckoutSessionTable.userId, userId),
        eq(stripeCheckoutSessionTable.credited, false),
        eq(stripeCheckoutSessionTable.expired, false),
      ),
    )
}

export const stripe = {
  processStripeOrder,
  insertCheckoutSession,
  getStripeOrderFromID,
  getPendingCheckoutSessionFromUserID,
}
