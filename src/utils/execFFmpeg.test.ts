import { expect, test } from '@jest/globals';
import { getVideoInfo } from './execFFmpeg';

test('getVideoInfo works', async () => {
  const videoPath = 'videos/avsynctest-vga-1m.mp4';
  const videoInfo = await getVideoInfo(videoPath);
  expect(videoInfo).toEqual({ frameCount: 1800, fps: 30 });
});
