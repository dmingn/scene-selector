const resourcesPath =
  process.env.NODE_ENV === 'production' ? process.resourcesPath : 'resources';

export const ffmpegPath = resourcesPath + '/bin/ffmpeg';
export const ffprobePath = resourcesPath + '/bin/ffprobe';
