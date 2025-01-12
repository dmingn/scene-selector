import {
  ffmpegPath as _ffmpegPath,
  ffprobePath as _ffprobePath,
} from 'ffmpeg-ffprobe-static';
import path from 'path';

const ffmpegDir =
  process.env.NODE_ENV === 'production'
    ? process.resourcesPath
    : 'node_modules/ffmpeg-ffprobe-static';

export const ffmpegPath = path.join(ffmpegDir, path.basename(_ffmpegPath));
export const ffprobePath = path.join(ffmpegDir, path.basename(_ffprobePath));
