import { test, expect } from './fixtures';

test.describe('Binary search modal', () => {
  test('can open, bisect, undo, and select a frame', async ({ page, videoVga1mPath }) => {
    await expect(page.locator('#root')).toBeVisible();

    await page.getByTestId('e2e-video-file-input').setInputFiles(videoVga1mPath);
    await expect(page.getByTestId('e2e-start-end-selector')).toBeVisible();

    const startView = page.getByTestId('e2e-frame-view-start');
    const startFrameBefore = await startView.getByTestId('e2e-frame-number').textContent();

    await startView.getByTestId('e2e-frame-view-start-binary-search-open').click();
    await expect(page.getByTestId('e2e-binary-search-modal-body')).toBeVisible();

    // Try a few bisections (buttons may become disabled depending on range).
    const left = page.getByTestId('e2e-bisect-left');
    const right = page.getByTestId('e2e-bisect-right');
    const undo = page.getByTestId('e2e-binary-search-undo');

    if (await left.isEnabled()) await left.click();
    if (await right.isEnabled()) await right.click();
    await expect(undo).toBeEnabled();
    await undo.click();

    // Select one of the currently displayed candidates.
    await page.getByTestId('e2e-binary-search-select-1').click();
    await expect(page.getByTestId('e2e-binary-search-modal-body')).toHaveCount(0);

    const startFrameAfter = await startView.getByTestId('e2e-frame-number').textContent();
    expect(startFrameAfter).not.toBeNull();
    expect(startFrameAfter).not.toBe(startFrameBefore);
  });
});

