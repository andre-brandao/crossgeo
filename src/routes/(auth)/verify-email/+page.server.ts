import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { user as userController } from '$db/controller'
import { sendMail, emailTemplate } from '$lib/server/email'

export const load = (async ({ locals }) => {
  const { user } = locals

  if (!user) {
    return { status: 302, redirect: '/login' }
  }

  if (user.email_verified) {
    return redirect(302, '/myprofile')
  }

  // const verificationCode = await userController.generateVerificationCode(
  //   user.id,
  //   { email: user.email },
  // )

  // try {
  //   await sendMail(user.email, emailTemplate.verificationCode(verificationCode))
  // } catch (error) {
  //   console.error(error)
  // }

  return {}
}) satisfies PageServerLoad
