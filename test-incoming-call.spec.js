import { test, expect } from '@playwright/test';

test.describe('Incoming Call Widget', () => {
  test('should open incoming call widget when clicking simulate button', async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('http://localhost:3005/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check if we're on login page, if so login
    if (await page.locator('h1:text-is("Login")').isVisible()) {
      await page.fill('input[type="email"]', 'admin@example.com');
      await page.fill('input[type="password"]', 'password');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
    }

    // Look for the phone widget
    await page.waitForSelector('.phone-card', { timeout: 10000 });

    // Find and click the simulate incoming call button
    await page.click('button:has-text("Simulate Incoming Call")');

    // Wait for the incoming call widget to appear
    await page.waitForSelector('.incoming-call-container.show', { timeout: 5000 });

    // Verify the phone frame is visible
    await expect(page.locator('.phone-frame')).toBeVisible();

    // Check that the caller name is displayed
    await expect(page.locator('.caller-name')).toBeVisible();
    await expect(page.locator('.caller-name')).toContainText('Mom');

    // Check that action buttons are present
    await expect(page.locator('.action-btn')).toHaveCount(3);
    await expect(page.locator('button:has-text("Remind Me")')).toBeVisible();
    await expect(page.locator('button:has-text("Message")')).toBeVisible();
    await expect(page.locator('button:has-text("Decline")')).toBeVisible();

    // Check the answer button with slide text
    await expect(page.locator('.answer-button')).toBeVisible();
    await expect(page.locator('.slide-text')).toContainText('Slide to Answer');

    // Test decline button
    await page.click('button:has-text("Decline")');

    // Verify the widget closes
    await page.waitForSelector('.incoming-call-container.show', { state: 'hidden', timeout: 3000 });
    await expect(page.locator('.incoming-call-container')).not.toBeVisible();
  });

  test('should test swipe-to-answer functionality', async ({ page }) => {
    // Navigate and login if needed
    await page.goto('http://localhost:3005/');
    await page.waitForLoadState('networkidle');

    if (await page.locator('h1:text-is("Login")').isVisible()) {
      await page.fill('input[type="email"]', 'admin@example.com');
      await page.fill('input[type="password"]', 'password');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
    }

    // Open incoming call
    await page.waitForSelector('.phone-card', { timeout: 10000 });
    await page.click('button:has-text("Simulate Incoming Call")');

    // Wait for widget to appear
    await page.waitForSelector('.incoming-call-container.show', { timeout: 5000 });

    // Get the answer button element
    const answerButton = page.locator('.answer-button');

    // Test mouse drag (simulate swipe)
    await answerButton.dragTo(answerButton, { targetPosition: { x: 100, y: 0 } });

    // Check if slide text changes
    await expect(page.locator('.slide-text')).toContainText('Release to Answer');

    // Complete the swipe by dragging further
    await answerButton.dragTo(answerButton, { targetPosition: { x: 120, y: 0 } });

    // Release the mouse button
    await page.mouse.up();

    // The call should be answered and widget should close
    await page.waitForTimeout(1000);
  });

  test('should test keyboard shortcuts', async ({ page }) => {
    // Navigate and login if needed
    await page.goto('http://localhost:3005/');
    await page.waitForLoadState('networkidle');

    if (await page.locator('h1:text-is("Login")').isVisible()) {
      await page.fill('input[type="email"]', 'admin@example.com');
      await page.fill('input[type="password"]', 'password');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
    }

    // Use keyboard shortcut to simulate incoming call (Ctrl+Shift+C)
    await page.keyboard.press('Control+Shift+KeyC');

    // Wait for the incoming call widget to appear
    await page.waitForSelector('.incoming-call-container.show', { timeout: 5000 });

    // Verify phone widget appears
    await expect(page.locator('.phone-frame')).toBeVisible();

    // Test escape key to hide
    await page.keyboard.press('Escape');

    // Verify widget closes
    await page.waitForSelector('.incoming-call-container.show', { state: 'hidden', timeout: 3000 });
    await expect(page.locator('.incoming-call-container')).not.toBeVisible();
  });

  test('should verify phone widget visual appearance', async ({ page }) => {
    // Navigate and login if needed
    await page.goto('http://localhost:3005/');
    await page.waitForLoadState('networkidle');

    if (await page.locator('h1:text-is("Login")').isVisible()) {
      await page.fill('input[type="email"]', 'admin@example.com');
      await page.fill('input[type="password"]', 'password');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');
    }

    // Open incoming call
    await page.waitForSelector('.phone-card', { timeout: 10000 });
    await page.click('button:has-text("Simulate Incoming Call")');

    // Wait for widget to appear
    await page.waitForSelector('.incoming-call-container.show', { timeout: 5000 });

    // Take a screenshot to verify visual appearance
    await page.screenshot({
      path: '/Users/marcpla/CallCenterCustom/tmp/incoming-call-widget.png',
      fullPage: true
    });

    // Verify specific visual elements
    const phoneFrame = page.locator('.phone-frame');
    await expect(phoneFrame).toHaveCSS('border-radius', '35px');

    // Check background gradient
    const callBackground = page.locator('.call-background');
    await expect(callBackground).toBeVisible();

    // Verify profile picture
    const profilePicture = page.locator('.profile-picture img');
    await expect(profilePicture).toBeVisible();

    // Verify status bar elements
    await expect(page.locator('.time')).toBeVisible();
    await expect(page.locator('.status-icons')).toBeVisible();

    // Verify action button styling
    const declineBtn = page.locator('.decline-btn .btn-icon');
    await expect(declineBtn).toHaveCSS('background-color', 'rgb(239, 68, 68)'); // #ef4444 in rgb

    // Close the widget
    await page.click('button:has-text("Decline")');
    await page.waitForSelector('.incoming-call-container.show', { state: 'hidden', timeout: 3000 });
  });
});
