import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

// import { user as userController } from '$db/controller'
// import { sendSMS } from '$lib/server/aws/sns'
// import { website } from '$lib/config'
export const load = (async ({ locals }) => {
  const { user } = locals

  if (!user) {
    return { status: 302, redirect: '/login' }
  }

  if (user.phone_verified) {
    return redirect(302, '/maps')
  }

  // const verificationCode = await userController.generateVerificationCode(
  //   user.id,
  //   { phone: user.phone },
  // )

  // try {
  //   await sendSMS(
  //     user.phone,
  //     `${website.siteShortTitle} verification code : ${verificationCode}`,
  //     'Verification',
  //   )
  // } catch (error) {
  //   console.error(error)
  // }

  // await sendMail(email, emailTemplate.verificationCode(verificationCode))

  return {}
}) satisfies PageServerLoad
