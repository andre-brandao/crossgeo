// import type { RequestHandler } from './$types'
// import { stripe } from '$lib/server/stripe'
// export const GET: RequestHandler = async () => {
//   return new Response()
// }

// export const POST: RequestHandler = async ({ request, url }) => {
//   const data = await request.json()

//   const cartItems = data.items

//   const lineItems = cartItems.map(item => ({
//     price_data: {
//       currency: 'usd',
//       product_data: {
//         name: item.name,
//         images: [],
//       },
//       unit_amount: item.price,
//     },
//     quantity: item.quantity,
//   }))

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: lineItems,
//     mode: 'payment',
//     success_url: `${url.origin}/checkout/success`,
//     cancel_url: `${url.origin}/checkout/cancel`,
//   })

//   return new Response()
// }
