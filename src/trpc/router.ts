// lib/trpc/router.ts

import { t } from './t'

import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

// ROUTES
import { auth } from '$db/schema/user/router'
import { pushNotification } from '$db/schema/push-notification/router'
import { mapa as map } from '$db/schema/map/router'

import { checkout } from '$db/schema/stripe/router'

import { bugReporter as bugReport } from '$db/schema/bug-report/router'

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
