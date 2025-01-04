import { z } from 'zod';

export const getVideoInfoInputSchema = z.object({ videoPath: z.string() });

export const getFrameImageBase64InputSchema = z.object({
  videoPath: z.string(),
  fps: z.number().positive(),
  frameNumber: z.number().int().nonnegative(),
});
