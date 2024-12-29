import { FormControlLabel, Switch, TextField, Tooltip } from '@mui/material';
import { useContext, useState } from 'react';
import { VideoContext } from '../contexts/VideoContext';
import { convertWinPathToWSL } from '../utils/convertWinPathToWSL';
import { frameNumberToTimecode } from '../utils/frameNumberToTimecode';
import { getOutPath } from '../utils/getOutPath';

export const CommandExample = (props: {
  startFrameNumber: number;
  endFrameNumber: number;
}) => {
  const { filePath, fps } = useContext(VideoContext);
  const [copyCodec, setCopyCodec] = useState(false);
  const [wsl, setWsl] = useState(false);

  const filePathConverted = wsl ? convertWinPathToWSL(filePath) : filePath;

  const command = [
    'ffmpeg',
    '-ss',
    frameNumberToTimecode(props.startFrameNumber, fps),
    '-i',
    `"${filePathConverted}"`,
    '-to',
    frameNumberToTimecode(
      props.endFrameNumber - props.startFrameNumber + 1,
      fps,
    ),
  ]
    .concat(copyCodec ? ['-c', 'copy'] : [])
    .concat([
      `"${getOutPath(filePathConverted, props.startFrameNumber, props.endFrameNumber)}"`,
    ])
    .join(' ');

  const [copied, setCopied] = useState(false);

  return (
    <div css={{ display: 'flex', gap: '8px' }}>
      <Tooltip
        placement="top"
        title={copied ? 'Copied' : 'Click to copy'}
        onClose={() => setCopied(false)}
        css={{ flex: 1 }}
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
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={copyCodec}
              onChange={(event) => {
                setCopyCodec(event.target.checked);
              }}
            />
          }
          label="Copy Codec"
        />
        {window.platform === 'win32' && (
          <FormControlLabel
            control={
              <Switch
                checked={wsl}
                onChange={(event) => {
                  setWsl(event.target.checked);
                }}
              />
            }
            label="WSL"
          />
        )}
      </div>
    </div>
  );
};
