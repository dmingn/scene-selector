import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { getFrameImageBase64, getVideoInfo } from './utils/execFFmpeg';

const t = initTRPC.create({ isServer: true });
const procedure = t.procedure;

export const router = t.router({
  getVideoInfo: procedure
    .input(z.object({ videoPath: z.string() }))
    .query(async ({ input: { videoPath } }) => {
      return await getVideoInfo(videoPath);
    }),
  getFrameImageBase64: procedure
    .input(
      z.object({
        videoPath: z.string(),
        fps: z.number(),
        frameNumber: z.number(),
      }),
    )
    .query(async ({ input: { videoPath, fps, frameNumber } }) => {
      return await getFrameImageBase64(videoPath, fps, frameNumber);
    }),
});

export type AppRouter = typeof router;
