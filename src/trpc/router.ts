// lib/trpc/router.ts

import { t } from './t'

import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

// ROUTES
import { auth } from './routes/auth'
import { pushNotification } from './routes/push-notification'
import { mapa as map } from './routes/map'

import { checkout } from './routes/stripe'

import { bugReporter as bugReport } from './routes/bugReport'


export const router = t.router({
  auth,

  pushNotification,
  map,
  checkout,
  bugReport,
})

export type Router = typeof router
export type RouterInputs = inferRouterInputs<Router>
export type RouterOutputs = inferRouterOutputs<Router>
