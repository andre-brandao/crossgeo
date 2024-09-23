import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { map } from '$db/controller'
export const load = (async ({ locals }) => {
  const { user } = locals
  if (!user) {
    redirect(303, '/login')
  }

  const datasets = await map.getUserData(user.id)

  const public_datasets = await map.getPublicData
  return {
    datasets,
    public_datasets,
  }
}) satisfies PageServerLoad
