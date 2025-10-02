import { test, expect } from '@playwright/test';

test.describe('Widget Activation and Drag Testing', () => {
  test('Navigate and activate widgets manually', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('http://localhost:3005/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take initial screenshot
    await page.screenshot({ path: 'tmp/initial-dashboard.png', fullPage: true });

    // Look for any buttons that might activate widgets
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons`);

    // Click buttons that might activate widgets
    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      const button = buttons[i];
      const text = await button.textContent().catch(() => '');
      console.log(`Button ${i}: "${text}"`);

      if (text.toLowerCase().includes('report') ||
          text.toLowerCase().includes('chat') ||
          text.toLowerCase().includes('widget')) {
        try {
          await button.click();
          await page.waitForTimeout(1000);
          console.log(`Clicked button: "${text}"`);
        } catch (e) {
          console.log(`Could not click button: "${text}"`);
        }
      }
    }

    // Look again for widgets after clicking
    await page.waitForTimeout(2000);

    const liveChatVisible = await page.locator('.live-chat-widget').isVisible().catch(() => false);
    const reportsVisible = await page.locator('.reports-widget').isVisible().catch(() => false);

    console.log('After clicking - Live Chat visible:', liveChatVisible);
    console.log('After clicking - Reports visible:', reportsVisible);

    // Take screenshot after attempts
    await page.screenshot({ path: 'tmp/after-clicks.png', fullPage: true });

    // Test the Reports Widget if visible
    if (reportsVisible) {
      console.log('Testing Reports Widget drag...');

      const widget = page.locator('.reports-widget').first();
      const initialPos = await widget.boundingBox();

      if (initialPos) {
        // Test dragging from header
        const header = widget.locator('.widget-header');
        const hasHeader = await header.isVisible();

        if (hasHeader) {
          await header.dragTo(page, {
            x: initialPos.x + 150,
            y: initialPos.y + 150
          });

          await page.waitForTimeout(500);

          const finalPos = await widget.boundingBox();
          const moved = (Math.abs(finalPos.x - initialPos.x) > 10) || (Math.abs(finalPos.y - initialPos.y) > 10);
          console.log('Reports Widget moved:', moved);

          if (moved) {
            // Test content interaction
            const content = widget.locator('.widget-content');
            if (await content.isVisible()) {
              await content.click();
              await content.hover();

              const cursorStyle = await page.evaluate(() => {
                const el = document.querySelector('.widget-content');
                return el ? window.getComputedStyle(el).cursor : 'not found';
              });
              console.log('Content cursor:', cursorStyle);
            }
          }
        }
      }
    }

    // Test Live Chat Widget if visible
    if (liveChatVisible) {
      console.log('Testing Live Chat Widget...');

      const widget = page.locator('.live-chat-widget').first();
      const initialPos = await widget.boundingBox();

      if (initialPos) {
        const header = widget.locator('.widget-header');

        // Try to drag from header
        await header.dragTo(page, {
          x: initialPos.x + 100,
          y: initialPos.y + 100
        });

        await page.waitForTimeout(500);

        const finalPos = await widget.boundingBox();
        const moved = (Math.abs(finalPos.x - initialPos.x) > 10) || (Math.abs(finalPos.y - initialPos.y) > 10);
        console.log('Live Chat Widget moved:', moved);

        // Test input interaction
        const messageInput = widget.locator('.message-input');
        if (await messageInput.isVisible()) {
          await messageInput.click();
          await messageInput.type('Test message from Playwright');

          const inputValue = await messageInput.inputValue();
          console.log('Input value:', inputValue);
          expect(inputValue).toContain('Test message');
        }
      }
    }
  });

  test('Test incoming call simulation', async ({ page }) => {
    await page.goto('http://localhost:3005/dashboard');
    await page.waitForLoadState('networkidle');

    // Look in the navbar/sidebar for call triggering buttons
    const navbar = page.locator('.navbar, nav, .sidebar');
    const callButtons = navbar.locator('button').filter({ hasText: /call|phone|simulate/i });

    if (await callButtons.count() > 0) {
      await callButtons.first().click();
      await page.waitForTimeout(1000);

      const incomingCallVisible = await page.locator('.incoming-call-container').isVisible().catch(() => false);
      console.log('Incoming call triggered:', incomingCallVisible);

      if (incomingCallVisible) {
        await page.screenshot({ path: 'tmp/incoming-call-triggered.png', fullPage: true });

        // Test incoming call widget interactions
        const answerButton = page.locator('.answer-button');
        if (await answerButton.isVisible()) {
          // Test swipe functionality
          await answerButton.hover();
          console.log('Answer button hover successful');
        }

        const closeButton = page.locator('.close-widget');
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await page.waitForTimeout(500);
          console.log('Close button clicked');
        }
      }
    }
  });
});
