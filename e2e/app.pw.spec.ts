import { test, expect } from './fixtures';

test.describe('App E2E smoke test', () => {
  test('app launches and loads video info', async ({ page, videoVga1mPath }) => {
    await expect(page.locator('#root')).toBeVisible();

    // Initial state: selector should not be present yet
    await expect(page.getByTestId('e2e-start-end-selector')).toHaveCount(0);

    const fileInput = page.getByTestId('e2e-video-file-input');
    await fileInput.setInputFiles(videoVga1mPath);

    const loading = page.getByTestId('e2e-loading-indicator');
    await expect(loading).toBeVisible();

    await expect(page.getByTestId('e2e-start-end-selector')).toBeVisible();
    await expect(loading).toBeHidden();
  });
});

