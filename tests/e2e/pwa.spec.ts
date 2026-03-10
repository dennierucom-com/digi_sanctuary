import { test, expect } from '@playwright/test';

test.describe('Digi Sanctuary PWA', () => {
  test('should display the dashboard and widgets', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page.locator('h1')).toHaveText('Digi Sanctuary');

    // Check widgets are rendered
    await expect(page.locator('h2', { hasText: 'Breathing Tool' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Ambient Noise' })).toBeVisible();
  });

  test('Settings Stepper correctly updates Breathing Tool card state', async ({ page }) => {
    await page.goto('/');

    const breathingCard = page.locator('.MuiCard-root', { hasText: 'Breathing Tool' });
    
    // Initially shows default pattern
    await expect(breathingCard.locator('p', { hasText: 'Pattern: 4-7-8' })).toBeVisible({ timeout: 10000 });

    // Open settings
    await breathingCard.locator('button[aria-label="settings"]').click();

    // Verify stepper is open
    await expect(page.locator('.MuiStepLabel-root', { hasText: 'Pattern' })).toBeVisible();

    // Change pattern directly
    await page.locator('#pattern-select-label').click();
    await page.locator('li[data-value="box"]').click();

    // Finish stepper
    await page.locator('button', { hasText: 'Next' }).click(); // to Speed
    await page.locator('button', { hasText: 'Next' }).click(); // to Visual
    await page.locator('button', { hasText: 'Done' }).click(); // Finish Settings

    // Check that card updated
    await expect(breathingCard.locator('p', { hasText: 'Pattern: box' })).toBeVisible();
  });

  test('PWA Manifest is linked correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for theme color meta tag
    const themeColor = await page.getAttribute('meta[name="theme-color"]', 'content');
    expect(themeColor).toBe('#C4B5E0');

    // Web manifest should be built by vite-plugin-pwa, mostly injected at build time,
    // but in dev server it is served at /manifest.webmanifest
    const response = await page.request.get('/manifest.webmanifest');
    expect(response.ok()).toBeTruthy();
    
    const manifest = await response.json();
    expect(manifest.name).toBe('Digi Sanctuary');
    expect(manifest.short_name).toBe('Sanctuary');
  });
});
