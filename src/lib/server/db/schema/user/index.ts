import {
  sqliteTable,
  text,
  integer,

  // customType,
} from 'drizzle-orm/sqlite-core'
import { sql, relations } from 'drizzle-orm'
import { mapTable } from '../map'
export const DEFAULT_USER_PERMISSIONS: UserPermissions = {
  role: 'user',
} as const

const DEFAULT_MAX_CREDITS = 100

export const userTable = sqliteTable('user', {
  id: text('id').notNull().primaryKey(),
  // .$defaultFn(() => generateId(15)),

  created_at: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),

  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
  phone: text('phone').unique().notNull(),
  phoneVerified: integer('phone_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
  password_hash: text('password_hash').notNull(),

  permissions: text('permissions', { mode: 'json' })
    .notNull()
    .$type<UserPermissions>()
    .default(DEFAULT_USER_PERMISSIONS),

  used_credits: integer('used_credits').default(0),
  max_credits: integer('max_credits').default(DEFAULT_MAX_CREDITS),
})

export const userRelations = relations(userTable, ({ many }) => ({
  maps: many(mapTable),
}))

export type SelectUser = typeof userTable.$inferSelect
export type InsertUser = typeof userTable.$inferInsert

// import { generateId } from 'lucia'
export interface DatabaseUser {
  id: string
  username: string
  email: string
  emailVerified: boolean
  phone: string
  phoneVerified: boolean
  permissions: UserPermissions
  used_credits: number
  max_credits: number
}

export type UserPermissions = {
  role: 'admin' | 'user'
}

// AUTH TABLES
export const sessionTable = sqliteTable('session', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'cascade',
    }),
  expiresAt: integer('expires_at').notNull(),
})

export type VerificationType = PhoneVerification | EmailVerification
type EmailVerification = {
  email: string
}
type PhoneVerification = { phone: string }

export function isVerificationPhone(
  ver: VerificationType,
): ver is PhoneVerification {
  return 'phone' in ver
}

export function isVerificationEmail(
  ver: VerificationType,
): ver is EmailVerification {
  return 'email' in ver
}
export const userVerificationCodeTable = sqliteTable('user_verification_code', {
  id: integer('id').notNull().primaryKey({ autoIncrement: true }),
  code: text('code').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'cascade',
    }),
  type: text('type', { mode: 'json' }).notNull().$type<VerificationType>(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
})

export const passwordResetCodeTable = sqliteTable('password_reset_code', {
  token_hash: text('token_hash').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'cascade',
    }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
})

export const magicLinkTable = sqliteTable('magic_link', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'cascade',
    }),
  email: text('email').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
})
