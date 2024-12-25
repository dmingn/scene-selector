import { execFile, ExecFileException } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';

// https://ja.vite.dev/guide/assets#the-public-directory
const ffmpegPath = 'ffmpeg';
const ffprobePath = 'ffprobe';

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

export const getFrameImage = async (videoPath: string, frameNumber: number) => {
  return new Promise<string>((resolve, reject) => {
    const tmpfile = os.tmpdir() + '/output.png';

    execFile(
      ffmpegPath,
      [
        '-i',
        videoPath,
        '-vf',
        'select=eq(n\\,' + frameNumber + ')',
        '-vsync',
        'vfr',
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
  frameNumber: number,
) => {
  return getFrameImage(videoPath, frameNumber).then((imagePath) => {
    return imageToBase64(imagePath);
  });
};
