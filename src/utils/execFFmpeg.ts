import { execFile, ExecFileException } from 'child_process';
import { app } from 'electron';
import {
  ffmpegPath as _ffmpegPath,
  ffprobePath as _ffprobePath,
} from 'ffmpeg-ffprobe-static';
import * as fs from 'fs';
import path from 'path';
import { frameNumberToTimecode } from './frameNumberToTimecode';

const ffmpegDir =
  process.env.NODE_ENV === 'production'
    ? process.resourcesPath
    : path.dirname(require.resolve('ffmpeg-ffprobe-static'));

const ffmpegPath = path.join(ffmpegDir, path.basename(_ffmpegPath));
const ffprobePath = path.join(ffmpegDir, path.basename(_ffprobePath));

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

function imageToBase64(filePath: string): string {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString('base64');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getFrameImage = async (
  videoPath: string,
  fps: number,
  frameNumber: number,
) => {
  return new Promise<string>((resolve, reject) => {
    const tmpfile = path.join(
      app.getPath('temp'),
      path.parse(videoPath).name + '-' + frameNumber + '.png',
    );

    execFile(
      ffmpegPath,
      [
        '-ss',
        frameNumberToTimecode(frameNumber, fps),
        '-copyts',
        '-i',
        videoPath,
        '-frames:v',
        '1',
        '-y',
        tmpfile,
      ],
      (error: ExecFileException | null) => {
        if (error) {
          reject(error);
        } else {
          resolve(tmpfile);
        }
      },
    );
  });
};

export const getFrameImageBase64 = async (
  videoPath: string,
  fps: number,
  frameNumber: number,
) => {
  return getFrameImage(videoPath, fps, frameNumber).then((imagePath) => {
    return imageToBase64(imagePath);
  });
};
