// import { faker } from '@faker-js/faker'
import { hash } from '@node-rs/argon2'
import { generateId } from 'lucia'
import { user } from './controller'

const main = async () => {
  await seedUsers()
}
main()

async function seedUsers() {
  console.log('userTable seed START')

  try {
    await user.insertUser({
      id: generateId(15),
      username: 'administrator',
      email: 'admin@admin.com',

      password_hash: await hash('senha123', {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      }),
    })
  } catch (error) {
    console.error('Failed to insert administrator:', error)
  }

  console.log('userTable seed END')
}
