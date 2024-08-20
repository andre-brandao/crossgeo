import { publicProcedure, router } from '$trpc/t'

import { z } from 'zod'
import { map as mapController, user as userController } from '$db/controller'
import { insertChartSchema } from '$db/schema'

import { geocodeAddress } from '$utils/geo'

import { middleware } from '$trpc/middleware'
import { TRPCError } from '@trpc/server'

import { isAdressInfo, isLatLongInfo } from '$utils/map'

export const mapa = router({
  creteMapGeocoding: publicProcedure
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

      if (user.max_credits < user.used_credits + raw_points.length) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User has insufficient credits',
        })
      }

      const [newMap] = await mapController
        .insertMap({
          created_by: user.id,
          name: map.name,
        })
        .returning()

      const [newMapData] = await mapController
        .insertMapData({
          map_id: newMap.id,
          fields_info: {
            address_field: map.fields_info.address_field,
            fields: map.fields_info.fields,
          },
        })
        .returning()

      let center = { lat: 0, lng: 0 }
      for (const point of raw_points) {
        try {
          const geocoded_point = await geocodeAddress(point.address)

          if (geocoded_point) {
            await mapController.insertPoints({
              lat: geocoded_point.lat,
              long: geocoded_point.lng,
              data_id: newMapData.id,
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

      await userController.updateUser(user.id, {
        used_credits: user.used_credits + raw_points.length,
      })

      return {
        success: true,
        map: newMap,
      }
    }),

  createMapLatLong: publicProcedure
    .input(
      z.object({
        map: z.object({
          name: z.string(),
          group_id: z.number().optional(),
          fields_info: z.object({
            lat_field: z.string(),
            long_field: z.string(),
            fields: z.string().array(),
          }),
        }),
        raw_points: z
          .object({
            lat: z.number(),
            lng: z.number(),
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

      if (user.max_credits < user.used_credits + raw_points.length) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User has insufficient credits',
        })
      }

      const [newMap] = await mapController
        .insertMap({
          created_by: user.id,
          name: map.name,
          lat: raw_points[0].lat,
          long: raw_points[0].lng,
        })
        .returning()

      const [newMapData] = await mapController
        .insertMapData({
          map_id: newMap.id,
          fields_info: {
            lat_field: map.fields_info.lat_field,
            long_field: map.fields_info.long_field,
            fields: map.fields_info.fields,
          },
        })
        .returning()

      const points = raw_points.map(point => ({
        lat: point.lat,
        long: point.lng,
        data_id: newMapData.id,
        meta_data: point.meta,
      }))

      await mapController.insertPoints(points)

      await userController.updateUser(user.id, {
        used_credits: user.used_credits + raw_points.length,
      })

      return {
        success: true,
        map: newMap,
      }
    }),

  addPointsGeocoding: publicProcedure
    .input(
      z.object({
        data_id: z.number(),
        raw_points: z
          .object({
            address: z.string(),
            meta: z.any(),
          })
          .array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { data_id, raw_points } = input
      const { user } = ctx.locals

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        })
      }

      if (user.max_credits < user.used_credits + raw_points.length) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User has insufficient credits',
        })
      }

      const retrievedMap = await mapController.getMapDataByID(data_id)

      if (!retrievedMap) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Map not found',
        })
      }

      if (!isAdressInfo(retrievedMap.fields_info)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Only possible to geocode when map is address based',
        })
      }

      if (retrievedMap?.map.created_by !== user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User does not have permission to add points to this map',
        })
      }

      for (const point of raw_points) {
        try {
          const geocoded_point = await geocodeAddress(point.address)

          if (geocoded_point) {
            await mapController.insertPoints({
              lat: geocoded_point.lat,
              long: geocoded_point.lng,
              data_id: data_id,
              meta_data: point.meta,
            })
          }
        } catch (error) {
          console.error(error)
        }
      }
    }),

  addPointsLatLong: publicProcedure
    .input(
      z.object({
        data_id: z.number(),
        raw_points: z
          .object({
            lat: z.number(),
            lng: z.number(),
            meta: z.any(),
          })
          .array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data_id, raw_points } = input
      const { user } = ctx.locals

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        })
      }

      if (user.max_credits < user.used_credits + raw_points.length) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User has insufficient credits',
        })
      }

      const retrievedMap = await mapController.getMapDataByID(data_id)

      if (!retrievedMap) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Map not found',
        })
      }

      if (!isLatLongInfo(retrievedMap.fields_info)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Only possible to add points when map is lat/long based',
        })
      }
      if (retrievedMap?.map.created_by !== user.id) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User does not have permission to add points to this map',
        })
      }
      const points = raw_points.map(point => ({
        lat: point.lat,
        long: point.lng,
        data_id: data_id,
        meta_data: point.meta,
      }))

      await mapController.insertPoints(points)
    }),

  createChart: publicProcedure
    .input(insertChartSchema)
    .mutation(async ({ input }) => {
      // @ts-expect-error can't infer type
      return mapController.insertChart(input)
    }),

  updateChart: publicProcedure
    .input(
      z.object({
        id: z.number(),
        chart: insertChartSchema.partial(),
      }),
    )
    .mutation(async ({ input }) => {
      const { chart } = input
      return mapController.updateChart(input.id, chart)
    }),

  deleteChart: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { id } = input

      return await mapController.deleteChart(id)
    }),

  //   deleteMap: publicProcedure
  //     .input(z.object({ id: z.number() }))
  //     .mutation(async ({ input, ctx }) => {
  //       const { id } = input

  //       return await mapController.de
  //     }),
})
