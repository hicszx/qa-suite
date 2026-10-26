import { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sort: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.sort = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  addToCart(slug: string) {
    return this.page.locator(`[data-test="add-to-cart-${slug}"]`).click();
  }

  removeFromCart(slug: string) {
    return this.page.locator(`[data-test="remove-${slug}"]`).click();
  }

  openProduct(name: string) {
    return this.page.locator('[data-test="inventory-item-name"]', { hasText: name }).click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
