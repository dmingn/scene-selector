import { execFile, ExecFileException } from 'child_process';
import { app } from 'electron';
import * as fs from 'fs';
import path from 'path';
import { ffmpegPath } from '../utils/ffmpeg';
import { frameNumberToTimecode } from '../utils/frameNumberToTimecode';

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
