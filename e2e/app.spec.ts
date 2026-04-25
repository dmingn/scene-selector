import path from 'path';
import { test, expect } from '@playwright/test';
import { _electron as electron } from 'playwright';

test('app launches and loads video info', async () => {
  const repoRoot = path.resolve(__dirname, '..');
  const videoPath = path.join(repoRoot, 'videos', 'avsynctest-vga-1m.mp4');

  const electronApp = await electron.launch({
    args: [path.join(repoRoot, '.vite', 'build', 'main.js')],
    env: {
      ...process.env,
      NODE_ENV: 'test',
    },
  });

  try {
    const page = await electronApp.firstWindow();

    await expect(page.locator('#root')).toBeVisible();

    // Initial state: selector should not be present yet
    await expect(page.getByTestId('e2e-start-end-selector')).toHaveCount(0);

    const fileInput = page.getByTestId('e2e-video-file-input');
    await fileInput.setInputFiles(videoPath);

    const loading = page.getByTestId('e2e-loading-indicator');
    await expect(loading).toBeVisible();

    await expect(page.getByTestId('e2e-start-end-selector')).toBeVisible();
    await expect(loading).toBeHidden();
  } finally {
    await electronApp.close();
  }
});

