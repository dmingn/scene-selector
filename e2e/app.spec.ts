import path from 'path';
import {
  test,
  expect,
  _electron as electron,
  type ElectronApplication,
} from '@playwright/test';

test.describe('App E2E smoke test', () => {
  let electronApp: ElectronApplication;
  const repoRoot = path.resolve(__dirname, '..');

  test.beforeEach(async () => {
    electronApp = await electron.launch({
      args: [path.join(repoRoot, '.vite', 'build', 'main.js')],
      env: {
        ...process.env,
        NODE_ENV: 'test',
      },
    });
  });

  test.afterEach(async () => {
    await electronApp.close();
  });

  test('app launches and loads video info', async () => {
    const videoPath = path.join(repoRoot, 'videos', 'avsynctest-vga-1m.mp4');
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
  });
});

