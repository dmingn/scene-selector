import { TextField, Tooltip } from '@mui/material';
import { useContext, useState } from 'react';
import { VideoContext } from '../contexts/VideoContext';
import { frameNumberToTimecode } from '../utils/frameNumberToTimecode';
import { getOutPath } from '../utils/getOutPath';

export const CommandExample = (props: {
  startFrameNumber: number;
  endFrameNumber: number;
}) => {
  const { filePath, fps } = useContext(VideoContext);

  const command = [
    'ffmpeg',
    '-ss',
    frameNumberToTimecode(props.startFrameNumber, fps),
    '-i',
    `"${filePath}"`,
    '-to',
    frameNumberToTimecode(
      props.endFrameNumber - props.startFrameNumber + 1,
      fps,
    ),
    `"${getOutPath(filePath, props.startFrameNumber, props.endFrameNumber)}"`,
  ].join(' ');

  const [copied, setCopied] = useState(false);

  return (
    <Tooltip
      placement="top"
      title={copied ? 'Copied' : 'Click to copy'}
      onClose={() => setCopied(false)}
    >
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
        multiline
        onClick={() => {
          navigator.clipboard.writeText(command);
          setCopied(true);
        }}
      />
    </Tooltip>
  );
};
