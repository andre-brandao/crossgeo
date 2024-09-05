import { publicProcedure, router } from '$trpc/t'

import { z } from 'zod'
import { sendSMS } from './sns'

export const awsRouter = router({
  testSMS: publicProcedure
    .input(
      z.object({
        number: z.string(),
        message: z.string(),
        subject: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await sendSMS(input.number, input.message, input.subject)
      return 'SMS sent'
    }),
})
