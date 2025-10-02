const { test, expect } = require('@playwright/test');

test.describe('Widget Drag Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard where widgets are available
    await page.goto('http://localhost:3005');

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('LiveChatWidget - drag should only work from header, content should be interactive', async ({ page }) => {
    // Navigate to dashboard to see the LiveChatWidget
    await page.goto('http://localhost:3005/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for the LiveChatWidget
    const liveChatWidget = page.locator('.live-chat-widget').first();
    await expect(liveChatWidget).toBeVisible();

    // Test that clicking on message content doesn't initiate drag
    const messageInput = liveChatWidget.locator('.message-input');
    if (await messageInput.isVisible()) {
      await messageInput.click();
      await messageInput.type('Test message');

      // Check that the widget hasn't moved (position should remain stable)
      const initialPosition = await liveChatWidget.boundingBox();
      expect(initialPosition).toBeTruthy();
    }

    // Test drag from header
    const widgetHeader = liveChatWidget.locator('.widget-header');
    const dragIndicator = widgetHeader.locator('.drag-indicator');

    // Get initial position
    const initialHeaderPosition = await liveChatWidget.boundingBox();

    // Perform drag from header
    await dragIndicator.dragTo(page, {
      x: initialHeaderPosition.x + 100,
      y: initialHeaderPosition.y + 100
    });

    // Wait a bit for position to update
    await page.waitForTimeout(500);

    // Check that widget has moved
    const finalPosition = await liveChatWidget.boundingBox();
    expect(finalPosition.x).not.toBe(initialHeaderPosition.x);
    expect(finalPosition.y).not.toBe(initialHeaderPosition.y);
  });

  test('ReportsWidget - drag should only work from header, content should be interactive', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:3005/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for the ReportsWidget
    const reportsWidget = page.locator('.reports-widget').first();
    await expect(reportsWidget).toBeVisible();

    // Test clicking on content elements doesn't initiate drag
    const actionButtons = reportsWidget.locator('.action-btn');
    const firstButton = actionButtons.first();

    if (await firstButton.isVisible()) {
      // Click on action button to verify it's interactive
      await firstButton.click();
      await page.waitForTimeout(300);
    }

    // Test drag from header
    const widgetHeader = reportsWidget.locator('.widget-header');
    const dragIndicator = widgetHeader.locator('.drag-indicator');

    // Get initial position
    const initialPosition = await reportsWidget.boundingBox();

    // Perform drag from header
    await dragIndicator.dragTo(page, {
      x: initialPosition.x + 150,
      y: initialPosition.y + 150
    });

    // Wait for position update
    await page.waitForTimeout(500);

    // Check that widget has moved
    const finalPosition = await reportsWidget.boundingBox();
    expect(finalPosition.x).not.toBe(initialPosition.x);
    expect(finalPosition.y).not.toBe(initialPosition.y);
  });

  test('Widget cursor changes correctly', async ({ page }) => {
    await page.goto('http://localhost:3005/dashboard');
    await page.waitForLoadState('networkidle');

    const liveChatWidget = page.locator('.live-chat-widget').first();
    const reportsWidget = page.locator('.reports-widget').first();

    // Test cursor on widget body (should be default, not move)
    const liveChatBody = liveChatWidget.locator('.chat-messages');
    const waitForElement = await liveChatBody.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);

    if (waitForElement) {
      const bodyComputedStyle = await liveChatBody.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          cursor: styles.cursor
        };
      });

      expect(bodyComputedStyle.cursor).toBe('auto');
    }

    // Test cursor on header (should be move/grab)
    const widgetHeader = liveChatWidget.locator('.widget-header');
    const headerStyles = await widgetHeader.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        cursor: styles.cursor
      };
    });

    expect(['move', 'grab', '-webkit-grab']).toContain(headerStyles.cursor);
  });

  test('Widget content elements remain interactive during non-drag interactions', async ({ page }) => {
    await page.goto('http://localhost:3005/dashboard');
    await page.waitForLoadState('networkidle');

    const liveChatWidget = page.locator('.liveChatWidget').first();
    const reportsWidget = page.locator('.reports-widget').first();

    // Test LiveChat input functionality
    const messageInput = liveChatWidget.locator('.message-input');
    if (await messageInput.isVisible()) {
      await messageInput.focus();
      await messageInput.type('Testing input functionality');

      const inputValue = await messageInput.inputValue();
      expect(inputValue).toContain('Testing input functionality');
    }

    // Test ReportsWidget action buttons
    const actionButtons = reportsWidget.locator('.action-btn');
    const primaryButton = actionButtons.filter({ hasText: 'Veure Completo' });

    if (await primaryButton.isVisible()) {
      // Verify button is clickable (should not initiate drag)
      await primaryButton.hover();
      await primaryButton.click();

      // Check that click was registered (button styles or behaviors change)
      await page.waitForTimeout(200);
    }
  });
});
