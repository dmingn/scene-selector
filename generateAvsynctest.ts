import { execFile } from 'child_process';
import { Command } from 'commander';
import { ffmpegPath } from 'ffmpeg-ffprobe-static';
import { promisify } from 'util';

const execFilePromise = promisify(execFile);

const generateAvsynctest = async (
  output: string,
  duration: string,
  size: string,
) => {
  const args = [
    '-f',
    'lavfi',
    '-i',
    `avsynctest=duration=${duration}:size=${size}[out0][out1]`,
    '-y',
    output,
  ];

  try {
    const { stdout, stderr } = await execFilePromise(ffmpegPath, args);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    console.error(`An error occurred while executing the command: ${error}`);
  }
};

const program = new Command();

program
  .argument('<output>', 'Path to the output file')
  .option('-d, --duration <duration>', 'Duration of the video in seconds', '60')
  .option('-s, --size <size>', 'Size of the video (e.g., 640x480, vga)', 'vga')
  .action(async (output, options) => {
    const { duration, size } = options;
    await generateAvsynctest(output, duration, size);
  });

program.parse(process.argv);
