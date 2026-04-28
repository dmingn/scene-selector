import { expect, test } from './fixtures';

test.describe('Range narrowing modal', () => {
  test('can open, narrow, undo, and select a frame', async ({
    page,
    videoVga1mPath,
  }) => {
    await expect(page.locator('#root')).toBeVisible();

    await page
      .getByTestId('e2e-video-file-input')
      .setInputFiles(videoVga1mPath);
    await expect(page.getByTestId('e2e-start-end-selector')).toBeVisible();

    const startView = page.getByTestId('e2e-frame-view-start');
    const startFrameBefore = await startView
      .getByTestId('e2e-frame-number')
      .textContent();

    await startView
      .getByTestId('e2e-frame-view-start-range-narrowing-open')
      .click();
    await expect(
      page.getByTestId('e2e-range-narrowing-modal-body'),
    ).toBeVisible();

    const modalBody = page.getByTestId('e2e-range-narrowing-modal-body');

    // Zoom in once, then undo once.
    await modalBody.getByRole('button', { name: 'Zoom in' }).nth(3).click();
    const undo = modalBody.getByTestId('e2e-range-narrowing-undo');
    await expect(undo).toBeEnabled();
    await undo.click();

    // Zoom in until the modal switches to the final "Select" phase.
    for (let i = 0; i < 20; i++) {
      const zoomInButtons = modalBody.getByRole('button', { name: 'Zoom in' });
      if ((await zoomInButtons.count()) === 0) {
        break;
      }
      await zoomInButtons.nth(3).click();
    }

    // Select one of the currently displayed candidates.
    await modalBody.getByRole('button', { name: 'Select' }).nth(1).click();
    await expect(
      page.getByTestId('e2e-range-narrowing-modal-body'),
    ).toHaveCount(0);

    const startFrameAfter = await startView
      .getByTestId('e2e-frame-number')
      .textContent();
    expect(startFrameAfter).not.toBeNull();
    expect(startFrameAfter).not.toBe(startFrameBefore);
  });
});
