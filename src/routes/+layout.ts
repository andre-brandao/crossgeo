import type { LayoutLoad } from './$types'
import { dev } from '$app/environment'
import { inject } from '@vercel/analytics'

inject({ mode: dev ? 'development' : 'production' })

export const load = (async ({ data }) => {
  return data
}) satisfies LayoutLoad
