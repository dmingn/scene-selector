import { initTRPC } from '@trpc/server';
import {
  getFrameImageBase64InputSchema,
  getVideoInfoInputSchema,
} from './apiSchema';
import { getFrameImageBase64, getVideoInfo } from './utils/execFFmpeg';

const t = initTRPC.create({ isServer: true });
const procedure = t.procedure;

export const router = t.router({
  getVideoInfo: procedure
    .input(getVideoInfoInputSchema)
    .query(async ({ input: { videoPath } }) => {
      return await getVideoInfo(videoPath);
    }),
  getFrameImageBase64: procedure
    .input(getFrameImageBase64InputSchema)
    .query(async ({ input: { videoPath, fps, frameNumber } }) => {
      return await getFrameImageBase64(videoPath, fps, frameNumber);
    }),
});

export type AppRouter = typeof router;
