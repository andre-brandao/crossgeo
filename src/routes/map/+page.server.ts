import type { PageServerLoad } from './$types'

import { map } from '$db/controller'
import { error } from '@sveltejs/kit'

export const load = (async ({ locals }) => {
  const userID = locals.user?.id

  if (!userID) {
    return error(404, 'User not found')
  }
  // TODO: Promise.all()
  const user_maps = await map.getUserMaps(userID)
  const groups = await map.queryUserGroupsWithMaps(userID)

  return {
    user_maps,
    groups,
  }
}) satisfies PageServerLoad
