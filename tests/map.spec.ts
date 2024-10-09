import { test, expect } from '@playwright/test'
import { user as userController } from '../src/lib/server/db/schema/user/controller'
import { deleteUserForTesting, verifyNumberEmail} from './utils'
import type { InsertUser } from '$lib/server/db/schema'
import { hash } from '@node-rs/argon2'
import { generateId } from 'lucia'
import fs from 'fs/promises'

// Interface estendida para incluir a senha em texto claro
interface TestUser extends InsertUser {
  plainTextPassword: string
}

// Função auxiliar modificada para criar o usuário de teste
async function createTestUser(): Promise<TestUser> {
  console.log('entrou no create test user')

  const plainTextPassword = 'senha_forte@10'
  const passwordHash = await hash(plainTextPassword, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })

  return {
    id: generateId(15),
    username: 'usuarioTeste',
    phone: '+55 (31) 98858-1887',
    email: 'dsda@hotmail.com',
    password_hash: passwordHash,
    emailVerified: true,
    phoneVerified: true,
    permissions: { role: 'user' },
    used_credits: 0,
    max_credits: 100,
    plainTextPassword, // Armazenando a senha em texto claro apenas para teste
  }
}

let testUser: TestUser

test.beforeAll(async () => {
  testUser = await createTestUser()
  console.log('Usuário de teste criado:', testUser.id)
  await new Promise(r => setTimeout(r, 500))
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const insertedUser = await userController.insertUser({
      id: testUser.id,
      username: testUser.username,
      phone: testUser.phone,
      email: testUser.email,
      password_hash: testUser.password_hash,
      // Incluir outros campos obrigatórios aqui
    })
  } catch (error) {
    console.error('Erro ao inserir usuário de teste:', error)
    throw error
  }
  await new Promise(r => setTimeout(r, 500))
  await verifyNumberEmail(testUser.username)
})

test.afterAll(async () => {
  if (testUser) {
    console.log('Deletando usuário de teste:', testUser.username)
    try {
      await deleteUserForTesting(testUser.username)
      console.log('Usuário de teste deletado com sucesso')
    } catch (error) {
      console.error('Erro ao deletar usuário de teste:', error)
    }
  }
})



test('Upload CSV and verify number of map points', async ({ page }) => {
  // Leia o arquivo CSV e conte o número de instâncias
  const csvData = await fs.readFile(
    'E:/Projetos/crossgeo/tests/testData/divinopolis.csv',
    'utf-8',
  )
  const csvLines = csvData.split('\n')
  const numInstances = csvLines.length - 1
  console.log('Número de instâncias no CSV:', numInstances)

  await page.goto('http://localhost:5173/login')
  await page.waitForLoadState('load')
  await page.waitForSelector('role=tab[name="Entrar com senha"]')
  await page.getByRole('tab', { name: 'Entrar com senha' }).click()
  await page.waitForSelector('input[placeholder="Email"]', {
    state: 'visible',
    timeout: 5000,
  })
  await page.waitForTimeout(1000)
  await page.getByPlaceholder('Email').fill(testUser.email)
  await page.waitForSelector('#password', { state: 'visible' })
  await page.locator('#password').fill(testUser.plainTextPassword)
  await page.locator('#password').press('Enter')
  expect(await page.getByRole('alert').isHidden()).toBeTruthy()
  await page.getByRole('link', { name: 'Começar' }).click()
  await page.waitForLoadState('load')

  // Faça o upload do arquivo CSV e aguarde até que o mapa seja renderizado
  await page.getByRole('link', { name: 'Criar novo mapa Clique aqui' }).click()
  await page.setInputFiles(
    'input[type="file"]',
    'E:/Projetos/crossgeo/tests/testData/divinopolis.csv',
  )
  await page.locator('label').filter({ hasText: 'Campo de endereço' }).click()
  await page.getByLabel('Campo de endereço').selectOption('endereco completo')
  await page.getByPlaceholder('Nome do mapa').fill('Test Map')
  await page.getByRole('button', { name: 'Enviar' }).click()

  // Aguarde até que os pontos do mapa estejam visíveis
  await page.waitForSelector('.leaflet-marker-icon.map-marker', { state: 'visible' });

  // Conte o número de pontos no mapa
  const numMarkers = await page.locator('.leaflet-marker-icon.map-marker').count();
  console.log('Número de pontos no mapa:', numMarkers);
  console.log('Número de instâncias no CSV:', numInstances);

  // Verifique se o número de pontos no mapa corresponde ao número de instâncias no CSV
  expect(numMarkers).toBe(numInstances-1);
  
});