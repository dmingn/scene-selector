/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { TextField } from '@mui/material';
import { frameNumberToTimecode } from '../utils/frameNumberToTimecode';

const getOutPath = (
  filePath: string,
  startFrameNumber: number,
  endFrameNumber: number,
) => {
  const dir_and_base = filePath.split('.', 2)[0];
  const ext = filePath.split('.', 2)[1];

  const modifiedBase = `${dir_and_base}-${startFrameNumber}-${endFrameNumber}`;

  return `${modifiedBase}.${ext}`;
};

export const CommandPreview = (props: {
  filePath: string;
  fps: number;
  startFrameNumber: number;
  endFrameNumber: number;
}) => {
  const command = [
    'ffmpeg',
    '-ss',
    frameNumberToTimecode(props.startFrameNumber, props.fps),
    '-i',
    '"',
    props.filePath,
    '"',
    '-to',
    frameNumberToTimecode(
      props.endFrameNumber - props.startFrameNumber,
      props.fps,
    ),
    '-c',
    'copy',
    '"',
    getOutPath(props.filePath, props.startFrameNumber, props.endFrameNumber),
    '"',
  ].join(' ');

  return (
    <div css={css({ width: '100%' })}>
      <TextField
        type="text"
        label="FFmpeg command example"
        value={command}
        slotProps={{
          input: {
            readOnly: true,
          },
          inputLabel: { shrink: true },
        }}
        css={css({ width: '100%' })}
      />
    </div>
  );
};
