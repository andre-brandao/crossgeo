import { lucia } from '$lib/server/auth'
import { fail, redirect } from '@sveltejs/kit'

import type { Actions, PageServerLoad } from './$types'

import { map } from '$db/controller'
import { GOOGLE_MAPS_KEY } from '$env/static/private'

export const load = (async () => {

  const userID = 'vjrq1xz47vwhbxc'

  try {
    const user_maps = await map.getUserMaps(userID)
    return {
      user_maps,
    }
  } catch (error) {
    console.error(error)
  }

  return {
    user_maps:[],
    GOOGLE_MAPS_KEY
  }

  
}) satisfies PageServerLoad

export const actions: Actions = {
  signout: async event => {
    if (!event.locals.session) {
      return fail(401)
    }
    await lucia.invalidateSession(event.locals.session.id)
    const sessionCookie = lucia.createBlankSessionCookie()
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    })
    return redirect(302, '/login')
  },
}
