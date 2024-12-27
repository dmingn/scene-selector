import { execFile, ExecFileException } from 'child_process';
import { app } from 'electron';
import * as fs from 'fs';
import path from 'path';
import { frameNumberToTimecode } from './frameNumberToTimecode';

const resourcesPath =
  process.env.NODE_ENV === 'production' ? process.resourcesPath : 'resources';

const ffmpegPath = resourcesPath + '/bin/ffmpeg';
const ffprobePath = resourcesPath + '/bin/ffprobe';

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
            fps: eval(data.streams[0].r_frame_rate),
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
