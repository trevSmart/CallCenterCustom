import { test, expect } from '@playwright/test';

test.describe('Widget Exploration and Interaction', () => {
  test('Explore dashboard and find visible widgets', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:3005/dashboard');
    await page.waitForLoadState('networkidle');

    // Take a screenshot to see what's on the page
    await page.screenshot({ path: 'tmp/dashboard-screenshot.png', fullPage: true });

    // Wait for any dynamic content to load
    await page.waitForTimeout(2000);

    // Check what's currently visible
    console.log('Looking for widgets...');

    const liveChatVisible = await page.locator('.live-chat-widget').isVisible().catch(() => false);
    const reportsVisible = await page.locator('.reports-widget').isVisible().catch(() => false);
    const incomingCallVisible = await page.locator('.incoming-call-container').isVisible().catch(() => false);

    console.log('Live Chat Widget visible:', liveChatVisible);
    console.log('Reports Widget visible:', reportsVisible);
    console.log('Incoming Call Widget visible:', incomingCallVisible);

    // Also check for any floating widgets
    const allWidgets = await page.locator('[class*="widget"]').count();
    console.log('Total widgets found:', allWidgets);

    // Check for dashboard stats or phone widgets that might be visible
    const phoneWidgetVisible = await page.locator('.phone-card').isVisible().catch(() => false);
    const statsWidgetVisible = await page.locator('.stats-card').isVisible().catch(() => false);

    console.log('Phone Widget visible:', phoneWidgetVisible);
    console.log('Stats Widget visible:', statsWidgetVisible);

    // Take another screenshot after timeout
    await page.screenshot({ path: 'tmp/dashboard-after-wait.png', fullPage: true });
  });

  test('Test drag functionality on any visible widget', async ({ page }) => {
    await page.goto('http://localhost:3005/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Try to find any widget with drag functionality
    const draggableWidgets = page.locator('[class*="widget"][style*="fixed"], [class*="widget"][style*="absolute"]');
    const widgetCount = await draggableWidgets.count();

    if (widgetCount > 0) {
      const firstWidget = draggableWidgets.first();
      const initialPos = await firstWidget.boundingBox();

      if (initialPos) {
        console.log('Found draggable widget, testing drag...');

        // Try dragging from header if it exists
        const header = firstWidget.locator('.widget-header');
        const hasHeader = await header.isVisible().catch(() => false);

        if (hasHeader) {
          await header.dragTo(page, {
            x: initialPos.x + 100,
            y: initialPos.y + 100
          });

          await page.waitForTimeout(500);

          const finalPos = await firstWidget.boundingBox();
          if (finalPos) {
            const moved = (Math.abs(finalPos.x - initialPos.x) > 10) || (Math.abs(finalPos.y - initialPos.y) > 10);
            console.log('Widget moved:', moved);
            expect(moved).toBe(true);
          }
        } else {
          // If no header, try dragging the whole widget
          await firstWidget.dragTo(page, {
            x: initialPos.x + 100,
            y: initialPos.y + 100
          });

          await page.waitForTimeout(500);

          const finalPos = await firstWidget.boundingBox();
          if (finalPos) {
            const moved = (Math.abs(finalPos.x - initialPos.x) > 10) || (Math.abs(finalPos.y - initialPos.y) > 10);
            console.log('Widget moved:', moved);
          }
        }
      }
    } else {
      console.log('No draggable widgets found');
    }
  });

  test('Simulate incoming call widget', async ({ page }) => {
    await page.goto('http://localhost:3005/dashboard');
    await page.waitForLoadState('networkidle');

    // Try to find how to trigger an incoming call
    // Look for any buttons that might simulate calls
    const simulateButtons = page.locator('button').filter({ hasText: /simulate|call|phone/i });
    const buttonCount = await simulateButtons.count();

    console.log('Found simulate buttons:', buttonCount);

    if (buttonCount > 0) {
      await simulateButtons.first().click();
      await page.waitForTimeout(2000);

      // Check if incoming call widget appeared
      const incomingCallVisible = await page.locator('.incoming-call-container').isVisible().catch(() => false);
      console.log('Incoming call widget appeared:', incomingCallVisible);

      if (incomingCallVisible) {
        await page.screenshot({ path: 'tmp/incoming-call-widget.png', fullPage: true });
      }
    }
  });
});
