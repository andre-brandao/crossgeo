// import { test, expect } from '@playwright/test';
// import { deleteUserForTesting } from './utils';
// import { getVerificationCodeForTesting } from './utils';



// const validUser = {
//   username: 'andreimock',
//   phone: '+55 (31) 98858-1887',
//   email: 'teste.valido@hotmail.com',
//   password: 'senha_forte@10'
// };

// const invalidUser = {
//   username: 'andrei@', // Nome de usuário inválido
//   phone: '+55 (31) 98858-1887',
//   email: 'teste.valido@hotmail.com',
//   password: 'senha' 
// }


// async function fillForm(page, user) {
//   await page.getByPlaceholder('Usuario').fill(user.username);
//   await page.locator('#phone').fill(user.phone);
//   await page.getByPlaceholder('Email').fill(user.email);
//   await page.locator('#password').fill(user.password);
//   await page.locator('#password').press('Enter');
// }

// async function clearForm(page) {
//   await page.getByPlaceholder('Usuario').fill('');
//   await page.getByPlaceholder('Email').fill('');
//   await page.locator('#phone').fill('');
//   await page.locator('#password').fill('');
// }
// test('should show an error message for invalid password', async ({ page }) => {
//   await page.goto('http://localhost:5173/signup');
//   await fillForm(page, { ...validUser, password: invalidUser.password });
//   await expect(page.locator('.text-red-500'), 'A mensagem de senha inválida não apareceu como esperado').toHaveText('Invalid password');
//   await clearForm(page);
// });


// test('should show an error message for invalid username', async ({ page }) => {
//   await page.goto('http://localhost:5173/signup');
//   await fillForm(page, { ...invalidUser, password: validUser.password });
//   await expect(page.locator('.text-red-500'), 'A mensagem de nome de usuário inválido não apareceu como esperado').toHaveText('Invalid username');
//   await clearForm(page);
// });

// test('should register successfully with valid credentials', async ({ page }) => {
//   await page.goto('http://localhost:5173/signup');

//   await fillForm(page, validUser);
//   await expect(page.locator('.text-red-500'), 'Erro inesperado apareceu').toBeHidden();
//   await new Promise(r => setTimeout(r, 500));
//   const verificationCode = await getVerificationCodeForTesting(validUser.username);
//   console.log('Código de verificação obtido:', verificationCode);
//   for (let i = 0; i < verificationCode.length; i++) {
//     await page.locator(`.default-input:nth-child(${i + 1})`).fill(verificationCode[i]);
//   }
//   await page.getByRole('button', { name: 'Confirm' }).click();
// });

// test.afterAll(async () => {
//     //add a 0.5 delay:
//     await new Promise(r => setTimeout(r, 500));
//     console.log('Done with tests');
//     try {
//       await deleteUserForTesting(validUser.username); // Await if async
//       console.log(`User ${validUser.username} deleted successfully.`);
//     } catch (error) {
//       console.error(`Failed to delete user: ${error.message}`);
//     }
//   });