import { expect, test } from './fixtures';

test.describe('Range slider limits', () => {
  test('right limit thumb can be adjusted with keyboard', async ({
    page,
    videoVga1mPath,
  }) => {
    await expect(page.locator('#root')).toBeVisible();

    await page.getByTestId('e2e-video-file-input').setInputFiles(videoVga1mPath);
    await expect(page.getByTestId('e2e-start-end-selector')).toBeVisible();
    await expect(page.getByTestId('e2e-command-example')).toBeVisible();

    // Thumbs are ordered: leftLimit, start, midLimit, end, rightLimit
    const slider = page.getByTestId('e2e-range-slider');
    const endInput = slider.locator('input[type="range"][data-index="3"]');
    const rightLimitInput = slider.locator('input[type="range"][data-index="4"]');

    // The reducer clamps rightLimit >= end, so first move end left to create room.
    await endInput.focus();
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('ArrowLeft');
    }

    const rightLimitBefore = Number(await rightLimitInput.inputValue());

    await rightLimitInput.focus();
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowLeft');
    }

    const rightLimitAfter = Number(await rightLimitInput.inputValue());
    expect(rightLimitAfter).toBeLessThan(rightLimitBefore);
    expect(rightLimitAfter).toBeGreaterThanOrEqual(Number(await endInput.inputValue()));
  });
});
