import type { PageServerLoad } from './$types';
import {map} from "$db/controller";
import { redirect } from '@sveltejs/kit';

export const load = (async ({locals}) => {
    //Tipo tinamicamente
    const userId = locals.user?.id;
    if(!userId){
        return redirect(303, "/login")
    }
    const dataSet = await map.getUserData(userId);

    return {dataSet: dataSet ?? []};
}) satisfies PageServerLoad;