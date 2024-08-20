import type { PageServerLoad } from './$types'

import { map } from '$db/controller'
import {  redirect } from '@sveltejs/kit'

export const load = (async ({ locals }) => {
  const userID = locals.user?.id

  if (!userID) {
    return redirect(303,'/login')
  }
  const user_maps = await map.getUserMaps(userID)

  return {
    user_maps,
  }
}) satisfies PageServerLoad
