import { expect, test } from './fixtures';

test.describe('Happy path', () => {
  test('range selection updates command and can copy', async ({
    page,
    videoVga1mPath,
  }) => {
    await expect(page.locator('#root')).toBeVisible();

    await page
      .getByTestId('e2e-video-file-input')
      .setInputFiles(videoVga1mPath);
    await expect(page.getByTestId('e2e-start-end-selector')).toBeVisible();
    await expect(page.getByTestId('e2e-command-example')).toBeVisible();

    const commandTextarea = page
      .getByTestId('e2e-ffmpeg-command')
      .locator('textarea')
      .first();

    const commandBefore = await commandTextarea.inputValue();
    await expect(commandTextarea).toContainText('ffmpeg');

    await expect(page.getByTestId('e2e-copy-codec-switch')).not.toBeChecked();
    await page.getByTestId('e2e-copy-codec-switch').check();
    await expect(page.getByTestId('e2e-copy-codec-switch')).toBeChecked();
    await expect(commandTextarea).toContainText('-c copy');

    // Move the end slider thumb a bit to force command change.
    const endThumb = page
      .locator('[data-testid="e2e-range-slider"] .MuiSlider-thumb')
      .nth(3);
    await endThumb.focus();
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowLeft');
    }

    const commandAfter = await commandTextarea.inputValue();
    expect(commandAfter).not.toBe(commandBefore);

    // Deterministic clipboard assertion: override writeText and capture the last written text.
    await page.evaluate(() => {
      const windowAny = window as unknown as {
        __e2e_lastClipboardWrite: string | null;
      };
      windowAny.__e2e_lastClipboardWrite = null;

      const clipboard = navigator.clipboard as unknown as {
        writeText: (text: string) => Promise<void>;
      };
      clipboard.writeText = async (text: string) => {
        windowAny.__e2e_lastClipboardWrite = text;
      };
    });

    await commandTextarea.click();

    await expect(page.getByTestId('e2e-command-example')).toHaveAttribute(
      'data-copied',
      'true',
    );

    const copied = await page.evaluate(() => {
      const windowAny = window as unknown as {
        __e2e_lastClipboardWrite: string | null;
      };
      return windowAny.__e2e_lastClipboardWrite;
    });
    expect(copied).toBe(commandAfter);
  });
});
