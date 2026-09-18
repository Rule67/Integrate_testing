import {
  test,
  expect,
  BrowserContext,
  Page,
} from '@playwright/test';

// =====================================================
// DRIVER A
// ทำหน้าที่แทน Login Layer ด้านบน
// และเรียก Inventory + Cart
// =====================================================
async function driverOpenInventory(
  context: BrowserContext
): Promise<Page> {

  await context.addCookies([
    {
      name: 'session-username',
      value: 'standard_user',
      domain: 'www.saucedemo.com',
      path: '/',
    },
  ]);

  // ===================================================
  // เรียก Inventory
  // ===================================================
  const page = await context.newPage();

  await page.goto(
    'https://www.saucedemo.com/inventory.html'
  );

  await expect(
    page.locator('.inventory_list')
  ).toBeVisible();

  return page;
}

// =====================================================
// DRIVER A -> Inventory -> Add Cart -> Cart
// =====================================================
test(
  'Bottom-Up DRIVER: Driver A -> B Inventory -> E Add Cart -> Cart',
  async ({ browser }) => {

    const context = await browser.newContext();

    try {

      // =================================================
      // Driver A เรียก Inventory Layer
      // =================================================
      const page = await driverOpenInventory(context);

      // =================================================
      // B = Inventory จริง
      // =================================================
      await expect(
        page.locator('.inventory_item')
      ).toHaveCount(6);

      // =================================================
      // E = Add Cart จริง
      // =================================================
      await page
        .locator(
          '[data-test="add-to-cart-sauce-labs-backpack"]'
        )
        .click();

      await expect(
        page.locator('.shopping_cart_badge')
      ).toHaveText('1');

      // =================================================
      // Driver A เรียก Cart Layer
      // =================================================
      await page.goto(
        'https://www.saucedemo.com/cart.html'
      );

      // ตรวจสอบว่าเข้าสู่ Cart แล้ว
      await expect(
        page.locator('.cart_list')
      ).toBeVisible();

      // =================================================
      // ตรวจสอบสินค้าที่เพิ่มเข้า Cart
      // =================================================
      await expect(
        page.locator('.cart_item')
      ).toHaveCount(1);

      await expect(
        page.locator(
          '[data-test="inventory-item-name"]'
        )
      ).toHaveText('Sauce Labs Backpack');

    } finally {

      await context.close();

    }
  }
);