import path from 'path';
import { test, expect } from './fixtures';

test.describe('Error handling', () => {
  test('shows an error when video info cannot be loaded', async ({ page, repoRoot }) => {
    await expect(page.locator('#root')).toBeVisible();

    const invalidPath = path.join(repoRoot, 'e2e', 'fixtures', 'invalid.txt');
    await page.getByTestId('e2e-video-file-input').setInputFiles(invalidPath);

    await expect(page.getByTestId('e2e-video-info-error')).toBeVisible();
    await expect(page.getByTestId('e2e-video-info-retry')).toBeVisible();
    await expect(page.getByTestId('e2e-video-info-reset')).toBeVisible();
  });

  test.use({ appEnv: { E2E_FORCE_FFMPEG_FAIL: '1' } });
  test('shows an error when frame image cannot be loaded', async ({
    page,
    videoVga1mPath,
  }) => {
    await expect(page.locator('#root')).toBeVisible();

    await page.getByTestId('e2e-video-file-input').setInputFiles(videoVga1mPath);
    await expect(page.getByTestId('e2e-start-end-selector')).toBeVisible();

    const startView = page.getByTestId('e2e-frame-view-start');
    await expect(startView.getByTestId('e2e-frame-image-error')).toBeVisible();
    await expect(startView.getByTestId('e2e-frame-image-retry')).toBeVisible();
  });
});

