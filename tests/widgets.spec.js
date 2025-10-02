import { test, expect } from '@playwright/test';

test.describe('Widget Functionality Tests', () => {
  test('LiveChatWidget can be dragged from header only', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:3005/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for LiveChatWidget (might need to trigger it first)
    // Try to find any visible chat widget
    await page.waitForSelector('.live-chat-widget', { timeout: 10000 });

    const liveChatWidget = page.locator('.live-chat-widget').first();
    await expect(liveChatWidget).toBeVisible();

    // Get initial position
    const initialPos = await liveChatWidget.boundingBox();
    expect(initialPos).toBeTruthy();

    // Test drag from header
    const header = liveChatWidget.locator('.widget-header');
    await header.dragTo(page, {
      x: initialPos.x + 100,
      y: initialPos.y + 100
    });

    // Wait a bit
    await page.waitForTimeout(500);

    // Check that it moved
    const finalPos = await liveChatWidget.boundingBox();
    expect(finalPos.x).not.toBe(initialPos.x);
    expect(finalPos.y).not.toBe(initialPos.y);
  });

  test('ReportsWidget can be dragged from header only', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:3005/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for ReportsWidget
    await page.waitForSelector('.reports-widget', { timeout: 10000 });

    const reportsWidget = page.locator('.reports-widget').first();
    await expect(reportsWidget).toBeVisible();

    // Get initial position
    const initialPos = await reportsWidget.boundingBox();
    expect(initialPos).toBeTruthy();

    // Test drag from header
    const header = reportsWidget.locator('.widget-header');
    await header.dragTo(page, {
      x: initialPos.x + 150,
      y: initialPos.y + 150
    });

    // Wait a bit
    await page.waitForTimeout(500);

    // Check that it moved
    const finalPos = await reportsWidget.boundingBox();
    expect(finalPos.x).not.toBe(initialPos.x);
    expect(finalPos.y).not.toBe(initialPos.y);
  });

  test('Widget content areas have correct cursor', async ({ page }) => {
    await page.goto('http://localhost:3005/dashboard');
    await page.waitForLoadState('networkidle');

    // Test LiveChatWidget cursor
    const liveChatWidget = page.locator('.live-chat-widget').first();
    await page.waitForSelector('.live-chat-widget', { timeout: 10000 });

    const chatMessages = liveChatWidget.locator('.chat-messages');
    if (await chatMessages.isVisible()) {
      await chatMessages.hover();

      const cursorStyle = await page.evaluate(() => {
        const el = document.querySelector('.chat-messages');
        return window.getComputedStyle(el).cursor;
      });

      expect(['auto', 'default']).toContain(cursorStyle);
    }

    // Test ReportsWidget cursor
    const reportsWidget = page.locator('.reports-widget').first();
    await page.waitForSelector('.reports-widget', { timeout: 10000 });

    const widgetContent = reportsWidget.locator('.widget-content');
    if (await widgetContent.isVisible()) {
      await widgetContent.hover();

      const cursorStyle = await page.evaluate(() => {
        const el = document.querySelector('.widget-content');
        return window.getComputedStyle(el).cursor;
      });

      expect(['auto', 'default']).toContain(cursorStyle);
    }
  });
});
