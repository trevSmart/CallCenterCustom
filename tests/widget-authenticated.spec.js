import { test, expect } from '@playwright/test';

test.describe('Widget Testing with Authentication', () => {
  test('Login and test widget interactions', async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3005/login');
    await page.waitForLoadState('networkidle');

    // Fill login form
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    const passwordInput = page.locator('input[type="password"], input[name="password"], input[placeholder*="password" i]');

    if (await emailInput.isVisible()) {
      await emailInput.fill('admin@example.com');
    }

    if (await passwordInput.isVisible()) {
      await passwordInput.fill('password');
    }

    // Look for login button
    const loginButton = page.locator('button').filter({ hasText: /login|sign in|entrar/i }).first();

    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Check if we're redirected to dashboard
      const currentUrl = page.url();
      console.log('Current URL after login:', currentUrl);

      if (currentUrl.includes('dashboard') || !currentUrl.includes('login')) {
        console.log('Successfully logged in, testing widgets...');

        // Wait for widgets to load
        await page.waitForTimeout(3000);

        // Take screenshot to see what's available
        await page.screenshot({ path: 'tmp/after-login.png', fullPage: true });

        // Test Reports Widget
        const reportsWidget = page.locator('.reports-widget');
        const reportsVisible = await reportsWidget.isVisible().catch(() => false);

        if (reportsVisible) {
          console.log('Reports Widget is visible, testing drag...');

          const initialPos = await reportsWidget.boundingBox();
          if (initialPos) {
            // Drag from header
            const header = reportsWidget.locator('.widget-header');
            const dragIndicator = header.locator('.drag-indicator');

            await dragIndicator.dragTo(page, {
              x: initialPos.x + 200,
              y: initialPos.y + 200
            });

            await page.waitForTimeout(1000);

            const finalPos = await reportsWidget.boundingBox();
            const movedHorizontally = Math.abs(finalPos.x - initialPos.x) > 50;
            const movedVertically = Math.abs(finalPos.y - initialPos.y) > 50;

            console.log(`Reports Widget moved - X: ${movedHorizontally}, Y: ${movedVertically}`);

            // Test content interaction
            const contentArea = reportsWidget.locator('.widget-content');
            await contentArea.click();

            const cursorStyle = await contentArea.evaluate(el =>
              window.getComputedStyle(el).cursor
            );
            console.log('Content cursor style:', cursorStyle);

            // Take screenshot after movement
            await page.screenshot({ path: 'tmp/reports-widget-moved.png', fullPage: true });

            expect(movedHorizontally || movedVertically).toBe(true);
          }
        }

        // Test Live Chat Widget (might appear after some interaction)
        const liveChatWidget = page.locator('.live-chat-widget');
        const liveChatVisible = await liveChatWidget.isVisible().catch(() => false);

        if (liveChatVisible) {
          console.log('Live Chat Widget is visible, testing...');

          const initialPos = await liveChatWidget.boundingBox();
          if (initialPos) {
            const header = liveChatWidget.locator('.widget-header');
            await header.dragTo(page, {
              x: initialPos.x + 150,
              y: initialPos.y + 150
            });

            await page.waitForTimeout(1000);

            const finalPos = await liveChatWidget.boundingBox();
            const moved = (Math.abs(finalPos.x - initialPos.x) > 50) || (Math.abs(finalPos.y - initialPos.y) > 50);
            console.log('Live Chat Widget moved:', moved);

            // Test input interaction
            const messageInput = liveChatWidget.locator('.message-input');
            if (await messageInput.isVisible()) {
              await messageInput.click();
              await messageInput.type('Testing input functionality');

              const inputValue = await messageInput.inputValue();
              console.log('Input value:', inputValue);
              expect(inputValue).toContain('Testing input');
            }
          }
        } else {
          console.log('Live Chat Widget not visible');

          // Try to trigger it by looking for chat list items
          const chatItems = page.locator('[class*="chat"]').filter({ hasText: /chat|message/i });
          const chatCount = await chatItems.count();
          console.log('Found chat items:', chatCount);

          if (chatCount > 0) {
            await chatItems.first().click();
            await page.waitForTimeout(2000);

            const liveChatNowVisible = await page.locator('.live-chat-widget').isVisible().catch(() => false);
            console.log('Live Chat Widget visible after click:', liveChatNowVisible);
          }
        }

        // Test cursor styles on different areas
        const widgets = page.locator('[class*="widget"]');
        const widgetCount = await widgets.count();
        console.log('Total widgets found:', widgetCount);

        for (let i = 0; i < Math.min(widgetCount, 3); i++) {
          const widget = widgets.nth(i);
          const className = await widget.getAttribute('class');

          // Test header cursor
          const header = widget.locator('.widget-header').first();
          if (await header.isVisible()) {
            const headerCursor = await header.evaluate(el =>
              window.getComputedStyle(el).cursor
            );
            console.log(`Widget ${i} header cursor:`, headerCursor);
          }

          // Test content cursor
          const content = widget.locator('.widget-content').first();
          if (await content.isVisible()) {
            const contentCursor = await content.evaluate(el =>
              window.getComputedStyle(el).cursor
            );
            console.log(`Widget ${i} content cursor:`, contentCursor);
          }
        }

      } else {
        console.log('Login might have failed, staying on login page');
      }
    }
  });

  test('Test widget cursor behavior specifically', async ({ page }) => {
    await page.goto('http://localhost:3005/login');
    await page.waitForLoadState('networkidle');

    // Quick login (assuming same credentials)
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button:has-text("Login")');
    await page.waitForURL('**/dashboard');
    await page.waitForTimeout(3000);

    // Focus on cursor tests
    const reportsWidget = page.locator('.reports-widget');

    if (await reportsWidget.isVisible()) {
      // Test cursor on different parts
      const header = reportsWidget.locator('.widget-header');
      const content = reportsWidget.locator('.widget-content');
      const actions = reportsWidget.locator('.widget-actions');

      if (await header.isVisible()) {
        await header.hover();
        const headerCursor = await header.evaluate(el => window.getComputedStyle(el).cursor);
        console.log('Header cursor:', headerCursor);
        expect(['move', 'grab', '-webkit-grab', 'ew-resize']).toContain(headerCursor);
      }

      if (await content.isVisible()) {
        await content.hover();
        const contentCursor = await content.evaluate(el => window.getComputedStyle(el).cursor);
        console.log('Content cursor:', contentCursor);
        expect(['auto', 'default', 'pointer']).toContain(contentCursor);
      }

      if (await actions.isVisible()) {
        await actions.hover();
        const actionsCursor = await actions.evaluate(el => window.getComputedStyle(el).cursor);
        console.log('Actions cursor:', actionsCursor);
        expect(['auto', 'default', 'pointer']).toContain(actionsCursor);
      }
    }
  });
});
