import { execFile, ExecFileException } from 'child_process';
import { ffprobePath } from '../utils/ffmpeg';

const parseFrameRate = (fraction: string): number | null => {
  const parts = fraction.split('/');

  if (parts.length === 2) {
    const numerator = parseFloat(parts[0]);
    const denominator = parseFloat(parts[1]);

    if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
      return numerator / denominator;
    }
  }

  return null;
};

export const getVideoInfo = async (videoPath: string) => {
  return new Promise<{ frameCount: number; fps: number }>((resolve, reject) => {
    execFile(
      ffprobePath,
      [
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-show_entries',
        'stream=nb_frames,r_frame_rate',
        '-of',
        'json',
        videoPath,
      ],
      (error: ExecFileException | null, stdout: string) => {
        if (error) {
          reject(error);
        } else {
          const data = JSON.parse(stdout);
          resolve({
            frameCount: parseInt(data.streams[0].nb_frames),
            fps: parseFrameRate(data.streams[0].r_frame_rate),
          });
        }
      },
    );
  });
};
