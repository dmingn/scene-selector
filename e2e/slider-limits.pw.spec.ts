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

    const endFrame = page
      .getByTestId('e2e-frame-view-end')
      .getByTestId('e2e-frame-number');
    const endBefore = await endFrame.textContent();

    // Thumbs are ordered: leftLimit, start, midLimit, end, rightLimit
    const rightLimitThumb = page
      .locator('[data-testid="e2e-range-slider"] .MuiSlider-thumb')
      .nth(4);
    await rightLimitThumb.click();
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowLeft');
    }

    const endAfter = await endFrame.textContent();
    expect(endAfter).not.toBe(endBefore);
  });
});
