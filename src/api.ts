import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { getFrameImageBase64, getVideoInfo } from './utils/execFFmpeg';

const t = initTRPC.create({ isServer: true });
const procedure = t.procedure;

export const router = t.router({
  getVideoInfo: procedure
    .input(z.object({ path: z.string() }))
    .query(async ({ input: { path } }) => {
      return await getVideoInfo(path);
    }),
  getFrameImageBase64: procedure
    .input(z.object({ path: z.string(), frameNumber: z.number() }))
    .query(async ({ input: { path, frameNumber } }) => {
      return await getFrameImageBase64(path, frameNumber);
    }),
});

export type AppRouter = typeof router;
