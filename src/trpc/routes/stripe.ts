import { publicProcedure, router } from '../t'

import { z } from 'zod'
// import { insertMapSchema, type InsertMapPoint } from '$db/schema'

import { middleware } from '../middleware'
import { TRPCError } from '@trpc/server'
import { stripe } from '$lib/server/stripe'

export const checkout = router({
  createCheckoutSession: publicProcedure
    .use(middleware.auth)
    .input(
      z.object({
        items: z.array(
          z.object({
            price_data: z.object({
              product_data: z.object({
                name: z.string(),
                images: z.array(z.string()),
              }),
              unit_amount: z.number(),
            }),
            quantity: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { items } = input
      const { url } = ctx

      const lineItems = items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.price_data.product_data.name,
            images: item.price_data.product_data.images,
          },
          unit_amount: item.price_data.unit_amount,
        },
        quantity: item.quantity,
      }))

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${url.origin}/checkout/success`,
        cancel_url: `${url.origin}/checkout/cancel`,
      })

      return {
        payment_url: session.url,
      }
    }),

  //   deleteMap: publicProcedure
  //     .input(z.object({ id: z.number() }))
  //     .mutation(async ({ input, ctx }) => {
  //       const { id } = input

  //       return await mapController.de
  //     }),
})
