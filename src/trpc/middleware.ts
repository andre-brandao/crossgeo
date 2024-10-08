import { t } from '$trpc/t'
import { TRPCError } from '@trpc/server'

const admin = t.middleware(async ({ next, ctx }) => {
  const { user } = ctx.locals
  if (!(user?.permissions.role === 'admin'))
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be an admin to access this route',
    })
  return next()
})

const auth = t.middleware(async ({ next, ctx }) => {
  const { user } = ctx.locals
  if (!user)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this route',
    })
  return next()
})

const logged = t.middleware(async ({ next, path, type }) => {
  const start = Date.now()

  const result = await next()

  const durationMs = Date.now() - start
  const meta = { path: path, type: type, durationMs }

  if (result.ok) {
    console.log('OK request timing:', meta)
  } else {
    console.error('Non-OK request timing', meta)
  }

  return result
})

const phoneVerified = t.middleware(async ({ next, ctx }) => {
  const { user } = ctx.locals
  if (!user?.phone_verified)
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must verify your phone number to access this',
    })
  return next()
})
export const middleware = {
  admin,
  auth,
  logged,
  phoneVerified,
}
