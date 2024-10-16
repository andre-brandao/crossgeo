import { test, expect, type Page } from '@playwright/test'
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
  try {
    await userController.insertUser(await testUser.toInsertUser())
  } catch (e) {
    console.error(e)
  }
})

/**
 * Função a ser executada após terminar os testes
 */
test.afterAll(async () => {
  // Apagando o usuário criado
  try {
      await deleteUserForTesting(testUser.username)
  } catch (e) {
    console.error(e)
  }
})

/**
 * Vai para a página de Login e insere as credenciais.
 * @param page Elemento do PlayWright.
 */
async function insertCredentialsLoginPage(page: Page) {
  // Indo para o login por senha
  await page.goto('http://localhost:5173/login/password')

  // Verificando se chega a url '/login/password'
  await page.waitForURL('http://localhost:5173/login/password', {
    timeout: 10000,
  })

  // Inserindo credenciais
  await page.getByPlaceholder('Email').fill(testUser.email)
  await page.locator('#password').fill(testUser.password)
  await page.getByRole('button', { name: 'Continuar' }).click()
}

/**
 * Vai para a página Checkout.
 * @param page Elemento do PlayWright.
 */
async function goToCheckoutPage(page: Page) {

  // Realizando login
  await insertCredentialsLoginPage(page)

  // Esperando 1 segundo
  await page.waitForTimeout(1000)

  // Indo para as compras
  await page.goto('http://localhost:5173/checkout')

  // Verificando se chega a url '/checkout'
  await page.waitForURL('http://localhost:5173/checkout', { timeout: 10000 })

  // Verificando se a mensagem de erro é encontrada
  const errorMessage = await page
    .locator('text=500 Something went wrong')
    .isVisible()
  expect(errorMessage).toBe(false)
}

/**
 * Realiza o teste se a compre de GeoPoints leva para o site da Stripe.
 */
test('Testando se a compra de GeoPoints leva para o site da Stripe', async ({
                                                                              page,
                                                                            }) => {

  // Indo para a página de checkout
  await goToCheckoutPage(page)

  // Esperando 1 segundo
  await page.waitForTimeout(1000)

  // Adicionando 1000 GeoPoints
  await page.getByRole('button', { name: '+1000' }).click()

  // Esperando 1 segundos
  await page.waitForTimeout(1000)

  // Realizando a compra
  await page.getByRole('button', { name: 'Checkout' }).click()

  // Verificando se o site da Stripe carrega
  await page.waitForURL(new RegExp('https://checkout\\.stripe\\.com/.*'), {timeout: 10000})
})