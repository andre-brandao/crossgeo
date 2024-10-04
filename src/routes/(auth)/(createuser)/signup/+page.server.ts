import { lucia } from '$lib/server/auth'
import { fail, redirect } from '@sveltejs/kit'
import { generateId } from 'lucia'
import { hash } from '@node-rs/argon2'
import { LibsqlError } from '@libsql/client'

import type { Actions, PageServerLoad } from './$types'
// import { emailTemplate, sendMail } from '$lib/server/email'

import { user } from '$db/controller'
// import { website } from '$lib/config'
// import { sendSMS } from '$lib/server/aws/sns'
import { emailTemplate, sendMail } from '$lib/server/email'

export const load: PageServerLoad = async event => {
  if (event.locals.user) {
    return redirect(302, '/')
  }
  return {}
}

export const actions: Actions = {
  default: async event => {
    const formData = await event.request.formData()
    const username = formData.get('username')
    const password = formData.get('password')
    const email = formData.get('email')
    // const phone = formData.get('phone')
    if (
      typeof username !== 'string' ||
      username.length < 3 ||
      username.length > 50
      // !/^[a-z0-9_-]+$/.test(username)
    ) {
      return fail(400, {
        success: false,
        message: 'Invalid username',
      })
    }

    const [existsUsername] = await user.getUserByUsername(username)
    if (existsUsername) {
      return fail(400, {
        success: false,
        message: 'Username already in use',
      })
    }
    if (
      typeof password !== 'string' ||
      password.length < 6 ||
      password.length > 255
    ) {
      return fail(400, {
        success: false,
        message: 'Invalid password',
      })
    }
    if (
      typeof email !== 'string' ||
      email.length < 3 ||
      email.length > 255 ||
      !email.includes('@')
    ) {
      return fail(400, {
        success: false,

        message: 'Invalid email',
      })
    }
    const [existsEmail] = await user.getUserByEmail(email)
    if (existsEmail) {
      return fail(400, {
        success: false,
        message: 'Email already in use',
      })
    }
    // if (typeof phone !== 'string') {
    //   return fail(400, {
    //     success: false,
    //     message: 'Invalid Phone',
    //   })
    // }
    // const [existsPhone] = await user.getUserByPhone(phone)
    // if (existsPhone) {
    //   return fail(400, {
    //     success: false,
    //     message: 'Phone number already in use',
    //   })
    // }

    const passwordHash = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })
    const userId = generateId(15)

    try {
      await user.insertUser({
        id: userId,
        username,
        email,
        phone: 'null:' + email,
        emailVerified: false,
        password_hash: passwordHash,
        permissions: user.DEFAULT_USER_PERMISSIONS,
      })

      const verificationCode = await user.generateVerificationCode(userId, {
        email,
      })

      try {
        sendMail(email, emailTemplate.verificationCode(verificationCode))
      } catch (error) {
        console.error(error)
      }

      // try {
      //   await sendSMS(
      //     phone,
      //     `${website.siteShortTitle} verification code : ${verificationCode}`,
      //     'Verification',
      //   )
      // } catch (error) {
      //   console.error(error)
      // }

      const session = await lucia.createSession(userId, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes,
      })
    } catch (e) {
      console.error(e)

      if (e instanceof LibsqlError && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return fail(400, {
          success: false,
          message: 'Username or Email already used',
        })
      }
      return fail(500, {
        success: false,
        message: 'An unknown error occurred',
      })
    }
    return redirect(302, '/verify-email')
  },
}
