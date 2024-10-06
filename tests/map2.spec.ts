import { test, expect } from '@playwright/test';
import { user as userController } from '../src/lib/server/db/schema/user/controller';
import { deleteUserForTesting, getVerificationCodeForTesting, verifyNumberEmail } from './utils';
import type { InsertUser } from '$lib/server/db/schema';
import { hash } from '@node-rs/argon2';
import { generateId } from 'lucia';

// Interface estendida para incluir a senha em texto claro
interface TestUser extends InsertUser {
  plainTextPassword: string;
}

// Função auxiliar modificada para criar o usuário de teste
async function createTestUser(): Promise<TestUser> {
  console.log('entrou no create test user');

  const plainTextPassword = 'senha_forte@10';
  const passwordHash = await hash(plainTextPassword, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

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
    plainTextPassword // Armazenando a senha em texto claro apenas para teste
  };
}

let testUser: TestUser;

test.beforeAll(async () => {
  testUser = await createTestUser();
  console.log('Usuário de teste criado:', testUser.id);
  await new Promise(r => setTimeout(r, 500));
  try {
    const insertedUser = await userController.insertUser({
      id: testUser.id,
      username: testUser.username,
      phone: testUser.phone,
      email: testUser.email,
      password_hash: testUser.password_hash,
      // Incluir outros campos obrigatórios aqui
    });
    console.log('Usuário de teste inserido:', insertedUser.phone_verified);
  } catch (error) {
    console.error('Erro ao inserir usuário de teste:', error);
    throw error;
  }
  await new Promise(r => setTimeout(r, 500));
  await verifyNumberEmail(testUser.username);
});

// test.afterAll(async () => {
//   if (testUser) {
//     console.log('Deletando usuário de teste:', testUser.username);
//     try {
//       await deleteUserForTesting(testUser.username);
//       console.log('Usuário de teste deletado com sucesso');
//     } catch (error) {
//       console.error('Erro ao deletar usuário de teste:', error);
//     }
//   }
// });

// Teste modificado para usar a senha em texto claro
test('Login and attempt to upload map without name', async ({ page }) => {

    //npx playwright test --debug
    await page.goto('http://localhost:5173/login');
    await page.getByRole('tab', { name: 'Entrar com senha' }).click();
    await page.getByPlaceholder('Email').fill(testUser.email);
    await page.locator('#password').click();
    await page.locator('#password').fill(testUser.plainTextPassword);
    await page.locator('#password').press('Enter');
    expect(page.getByRole('alert').isHidden()).toBeTruthy();
    await page.getByRole('link', { name: 'Começar' }).click();
    


});