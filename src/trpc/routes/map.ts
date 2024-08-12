import { publicProcedure, router } from '../t'

import { z } from 'zod'
import { map as mapController } from '$db/controller'
// import { insertMapSchema, type InsertMapPoint } from '$db/schema'

import { geocodeAddress } from '$utils/geo'

import { middleware } from '../middleware'
import { TRPCError } from '@trpc/server'

export const mapa = router({
  creteMap: publicProcedure
    .use(middleware.auth)
    .input(
      z.object({
        map: z.object({
          name: z.string(),
          group_id: z.number().optional(),
          fields_info: z.object({
            address_field: z.string(),
            fields: z.string().array(),
          }),
        }),
        raw_points: z
          .object({
            address: z.string(),
            meta: z.any(),
          })
          .array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.locals
      const { map, raw_points } = input

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        })
      }

      const [newMap] = await mapController
        .insertMap({
          created_by: user.id,
          fields_info: {
            address_field: map.fields_info.address_field,
            fields: map.fields_info.fields,
          },
          name: map.name,
          group_id: map.group_id,
        })
        .returning()

      let center = { lat: 0, lng: 0 }
      for (const point of raw_points) {
        try {
          const geocoded_point = await geocodeAddress(point.address)

          if (geocoded_point) {
            await mapController.insertPoint({
              lat: geocoded_point.lat,
              long: geocoded_point.lng,
              map_id: newMap.id,
              meta_data: point.meta,
            })
            center = {
              lat: geocoded_point.lat,
              lng: geocoded_point.lng,
            }
          }
        } catch (error) {
          console.error(error)
        }
      }

      await mapController.updateMap(newMap.id, {
        lat: center.lat,
        long: center.lng,
      })

      return {
        success: true,
        map: newMap,
      }
    }),

  //   deleteMap: publicProcedure
  //     .input(z.object({ id: z.number() }))
  //     .mutation(async ({ input, ctx }) => {
  //       const { id } = input

  //       return await mapController.de
  //     }),
})
