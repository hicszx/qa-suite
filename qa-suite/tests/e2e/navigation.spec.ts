import { test, expect } from './fixtures';
import { parsePrice } from '../../src/helpers';

test.describe('E2E — Navegación (SauceDemo)', () => {
  test('el inventario lista 6 productos', async ({ loggedIn }) => {
    await expect(loggedIn.items).toHaveCount(6);
  });

  test('ordenar por precio (bajo → alto)', async ({ loggedIn }) => {
    await loggedIn.sort.selectOption('lohi');
    const prices = (await loggedIn.itemPrices.allTextContents()).map(parsePrice);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('ordenar por nombre (Z → A)', async ({ loggedIn }) => {
    await loggedIn.sort.selectOption('za');
    const names = await loggedIn.itemNames.allTextContents();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('detalle de producto y regreso al inventario', async ({ page, loggedIn }) => {
    await loggedIn.openProduct('Sauce Labs Backpack');
    await expect(page).toHaveURL(/inventory-item\.html\?id=4/);
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('agregar y quitar producto actualiza el badge del carrito', async ({ loggedIn }) => {
    await loggedIn.addToCart('sauce-labs-backpack');
    await expect(loggedIn.cartBadge).toHaveText('1');
    await loggedIn.removeFromCart('sauce-labs-backpack');
    await expect(loggedIn.cartBadge).toHaveCount(0);
  });

  test('logout regresa a la pantalla de login', async ({ page, loggedIn, loginPage }) => {
    await loggedIn.logout();
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
