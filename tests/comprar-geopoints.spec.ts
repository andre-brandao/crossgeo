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

test('Testando se a soma e a subtração dos GeoPoints para a compra estão corretas', async ({page}) => {

  // Indo para a página de checkout
  await goToCheckoutPage(page)

  // Seletor do valor da soma na página
  const sumSelector = "body > div > div.drawer > div.drawer-content.flex.h-screen.flex-col.overflow-hidden > div.h-full.overflow-scroll.overflow-x-auto > main > div.mb-5 > p"

  // Variável para a soma
  let sum = 200

  // Verificando se o valor está correto
  expect(parseInt(await page.locator(sumSelector).innerText())).toBe(sum)

  /**
   * Realiza a adição de um valor à variável sum, verificando se está correto.
   * @param value Valor a ser somado. Valores permitidos: 1000, 100, 50.
   */
  async function addValueToSum(value: number) {
    // Adicionando value
    await page.getByRole('button', { name: `+${value}` }).click()
    sum += value

    // Esperando 1 segundo
    await page.waitForTimeout(1000)

    // Verificando se o valor está correto
    expect(parseInt(await page.locator(sumSelector).innerText())).toBe(sum)
  }

  /**
   * Realiza a subtração de um valor à variável sum, verificando se está correto.
   * Valor a ser subtraído. Valores permitidos: 1000, 100, 50.
   */
  async function subtractValueToSum(value: number) {
    // Adicionando value
    await page.getByRole('button', { name: `-${value}` }).click()
    sum -= value

    // Esperando 1 segundo
    await page.waitForTimeout(1000)

    // Verificando se o valor está correto
    expect(parseInt(await page.locator(sumSelector).innerText())).toBe(sum)
  }

  // Adicionando 1000
  await addValueToSum(1000)

  // Adicionando 100
  await addValueToSum(100)

  // Adicionando 50
  await addValueToSum(50)

  // Subtraindo 100
  await subtractValueToSum(100)

  // Subtraindo 1000
  await subtractValueToSum(1000)

  // Subtraindo 50
  await subtractValueToSum(50)

  // Verificando se foi para 200
  expect(parseInt(await page.locator(sumSelector).innerText())).toBe(200)

  // Subtraindo 200
  await subtractValueToSum(100)
  await subtractValueToSum(100)

  await page.pause()
})