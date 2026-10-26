import { test, expect, USERS } from './fixtures';

test.describe('E2E — Login (SauceDemo)', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('login válido redirige al inventario', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard.user, USERS.standard.pass);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('contraseña incorrecta muestra error', async ({ page, loginPage }) => {
    await loginPage.login(USERS.standard.user, 'mala_clave');
    await expect(loginPage.error).toContainText('Username and password do not match');
    await expect(page).toHaveURL('/');
  });

  test('usuario bloqueado no puede entrar', async ({ loginPage }) => {
    await loginPage.login(USERS.locked.user, USERS.locked.pass);
    await expect(loginPage.error).toContainText('this user has been locked out');
  });

  test('usuario vacío muestra validación', async ({ loginPage }) => {
    await loginPage.login('', USERS.standard.pass);
    await expect(loginPage.error).toContainText('Username is required');
  });

  test('acceso directo a /inventory.html sin sesión es rechazado', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(loginPage.error).toContainText("You can only access '/inventory.html' when you are logged in");
  });
});
