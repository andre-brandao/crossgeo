import { test, expect } from '@playwright/test'
import { user as userController } from '../src/lib/server/db/schema/user/controller'
import { deleteUserForTesting } from './utils'
import { User } from './user'

// Criando usuário de teste
const testUser = new User(
  'john.doe',
  'john.doe@email.example',
  true,
  '+55 (99) 9 9999-9999',
  true,
  'ex1@!ple',
  { role: 'user' },
  0,
  100,
)

/**
 * Função a ser executada antes de iniciar os testes.
 */
test.beforeAll(async () => {
  // Adicionando usuário de teste ao banco de dados
  await userController.insertUser(await testUser.toInsertUser())
})

/**
 * Função a ser executada após terminar os testes
 */
test.afterAll(async () => {
  // Apagando o usuário criado
  await deleteUserForTesting(testUser.username)
})

/**
 * Realiza o teste se a compre de GeoPoints leva para o site da Stripe.
 */
test('Testando se a compra de GeoPoints leva para o site da Stripe', async ({
  page,
}) => {
  await page.goto('http://localhost:5173/login/password')
  await page.getByPlaceholder('Email').fill(testUser.email)
  await page.locator('#password').fill(testUser.password)
  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.goto('http://localhost:5173/checkout')
  await page.getByRole('button', { name: '+1000' }).click()
  await page.getByRole('button', { name: 'Checkout' }).click()
  await page.waitForURL(new RegExp('https://checkout\\.stripe\\.com/.*'), {timeout: 10000})
})
