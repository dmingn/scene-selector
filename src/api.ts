import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { getFrameImageBase64, getVideoInfo } from './utils/execFFmpeg';

const t = initTRPC.create({ isServer: true });
const procedure = t.procedure;

export const router = t.router({
  getVideoInfo: procedure
    .input(z.object({ path: z.string().nullish() }))
    .query(async ({ input: { path } }) => {
      if (!path) {
        return null;
      }
      return await getVideoInfo(path);
    }),
  getFrameImageBase64: procedure
    .input(
      z.object({
        path: z.string().nullish(),
        fps: z.number().nullish(),
        frameNumber: z.number().nullish(),
      }),
    )
    .query(async ({ input: { path, fps, frameNumber } }) => {
      if (!path || !fps || frameNumber === null || frameNumber === undefined) {
        return null;
      }
      return await getFrameImageBase64(path, fps, frameNumber);
    }),
});

export type AppRouter = typeof router;
