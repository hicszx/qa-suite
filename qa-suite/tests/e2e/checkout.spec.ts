import { test, expect } from './fixtures';
import { parsePrice } from '../../src/helpers';

const BACKPACK = 'sauce-labs-backpack';
const BIKE_LIGHT = 'sauce-labs-bike-light';

test.describe('E2E — Checkout (SauceDemo)', () => {
  test('flujo completo: carrito → datos → resumen → orden confirmada', async ({
    page, loggedIn, cartPage, checkoutPage,
  }) => {
    await loggedIn.addToCart(BACKPACK);
    await loggedIn.addToCart(BIKE_LIGHT);
    await expect(loggedIn.cartBadge).toHaveText('2');

    await loggedIn.cartLink.click();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.items).toHaveCount(2);

    await cartPage.checkoutButton.click();
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    await checkoutPage.fillInfo('Jix', 'QA', '86000');
    await checkoutPage.continueButton.click();

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(cartPage.items).toHaveCount(2);
    await checkoutPage.finishButton.click();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');

    await checkoutPage.backHome.click();
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(loggedIn.cartBadge).toHaveCount(0);
  });

  test('el resumen calcula subtotal + impuestos = total', async ({
    page, loggedIn, checkoutPage,
  }) => {
    await loggedIn.addToCart(BACKPACK);
    await loggedIn.addToCart(BIKE_LIGHT);
    await loggedIn.cartLink.click();
    await page.locator('[data-test="checkout"]').click();
    await checkoutPage.fillInfo('Jix', 'QA', '86000');
    await checkoutPage.continueButton.click();

    const subtotal = parsePrice(await checkoutPage.subtotal.innerText());
    const tax = parsePrice(await checkoutPage.tax.innerText());
    const total = parsePrice(await checkoutPage.total.innerText());
    expect(subtotal).toBeCloseTo(29.99 + 9.99, 2);
    expect(subtotal + tax).toBeCloseTo(total, 2);
  });

  test('validación: nombre requerido', async ({ page, loggedIn, checkoutPage }) => {
    await loggedIn.addToCart(BACKPACK);
    await loggedIn.cartLink.click();
    await page.locator('[data-test="checkout"]').click();
    await checkoutPage.continueButton.click();
    await expect(checkoutPage.error).toContainText('First Name is required');
  });

  test('cancelar en datos de envío regresa al carrito', async ({ page, loggedIn, checkoutPage }) => {
    await loggedIn.addToCart(BACKPACK);
    await loggedIn.cartLink.click();
    await page.locator('[data-test="checkout"]').click();
    await checkoutPage.cancelButton.click();
    await expect(page).toHaveURL(/cart\.html/);
  });
});
