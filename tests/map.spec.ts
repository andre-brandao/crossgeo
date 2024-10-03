import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Login and attempt to upload map without name', async ({ page }) => {
  // Navegar para a página de login
  await page.goto('http://localhost:5173/login');

  // Clicar na aba "Entrar com senha"
  await page.getByRole('tab', { name: 'Entrar com senha' }).click();

  // Preencher o email
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('usuario_mapa@hotmail.com');

  // Preencher a senha
  await page.locator('#password').click();
  await page.locator('#password').fill('senha_forte@');

  // Pressionar Enter para fazer login
  await page.locator('#password').press('Enter');

  // Esperar pelo redirecionamento e clicar em "Começar"
  await page.getByRole('link', { name: 'Começar' }).click();

  // Caminho para o arquivo CSV
  const filePath  = ('tests/testData/divinopolis.csv');

  // Clicar no botão de upload e selecionar o arquivo
  await page.locator('.hover\\:shadow-l').click();
  await page.locator('.hover\\:shadow-l').setInputFiles(filePath);

  // Clicar no botão de envio sem preencher o nome do mapa
  await page.getByRole('button', { name: 'Enviar' }).click();

  // Esperar pela mensagem de erro
  const errorToast = await page.waitForSelector('div[data-sonner-toast][data-type="error"]', { timeout: 5000 });

  // Verificar se a mensagem de erro está correta
  const errorMessage = await errorToast.textContent();
  expect(errorMessage).toContain('Map name is required');

  // Verificar se o toast de erro está visível
  const isVisible = await errorToast.isVisible();
  expect(isVisible).toBeTruthy();
});