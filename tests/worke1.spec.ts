import {
  test,
  expect,
  BrowserContext,
  Page,
} from '@playwright/test';

import path from 'path';
import { pathToFileURL } from 'url';

async function driverOpenCard(context: BrowserContext): Promise<Page> {
  const page = await context.newPage();

  const cardPath = path.resolve(process.cwd(), 'card.html');
  const cardUrl = pathToFileURL(cardPath).href;

  await page.goto(cardUrl);

  await expect(
    page.locator('[data-test="inventory-card-name"]')
  ).toBeVisible();

  return page;
}

test(
  'สร้าง stub ใหม่ 1 stub (card.html) สำหรับ Inventory โดยเพิ่มชื่อและนามสกุลตัวเองเข้าไปใน stub',
  async ({ browser }) => {
    const context = await browser.newContext();

    try {
      const page = await driverOpenCard(context);

      const fullName = page.locator(
        '[data-test="inventory-card-name"]'
      );

      await expect(fullName).toContainText('สุปรีชา ศรีศุภปรีดา');
      await expect(fullName).toHaveText('สุปรีชา ศรีศุภปรีดา');
    } finally {
      await context.close();
    }
  }
);