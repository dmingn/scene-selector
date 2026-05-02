import { css } from '@emotion/react';
import { FormControlLabel, Switch, TextField, Tooltip } from '@mui/material';
import type React from 'react';
import { useContext, useState } from 'react';
import { convertWinPathToWSL } from '../../utils/convertWinPathToWSL';
import { frameNumberToTimecode } from '../../utils/frameNumberToTimecode';
import { getOutPath } from '../../utils/getOutPath';
import { VideoInfoContext } from './context-providers/VideoInfoContextsProvider';

export const CommandExample = (props: {
  startFrameNumber: number;
  endFrameNumber: number;
  copyCodec: boolean;
  onCopyCodecChange: (value: boolean) => void;
  wsl: boolean;
  onWslChange: (value: boolean) => void;
}) => {
  const { filePath, fps } = useContext(VideoInfoContext);
  const {
    startFrameNumber,
    endFrameNumber,
    copyCodec,
    onCopyCodecChange,
    wsl,
    onWslChange,
  } = props;

  const filePathConverted = wsl ? convertWinPathToWSL(filePath) : filePath;

  const command = [
    'ffmpeg',
    '-ss',
    frameNumberToTimecode(startFrameNumber, fps),
    '-i',
    `"${filePathConverted}"`,
    '-to',
    frameNumberToTimecode(endFrameNumber - startFrameNumber + 1, fps),
  ]
    .concat(copyCodec ? ['-c', 'copy'] : [])
    .concat([
      `"${getOutPath(filePathConverted, startFrameNumber, endFrameNumber)}"`,
    ])
    .join(' ');

  const [copied, setCopied] = useState(false);

  type SwitchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    'data-testid': string;
  };
  const switchInputProps = (testId: string): SwitchInputProps => ({
    'data-testid': testId,
  });

  return (
    <div
      data-testid="e2e-command-example"
      data-copied={copied ? 'true' : 'false'}
      css={{ display: 'flex', gap: '8px' }}
    >
      <Tooltip
        placement="top"
        title={copied ? 'Copied' : 'Click to copy'}
        onClose={() => setCopied(false)}
        css={{ flex: 1 }}
      >
        <TextField
          data-testid="e2e-ffmpeg-command"
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
          css={css({ '.MuiInputBase-root': { flex: 1 } })}
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
              inputProps={switchInputProps('e2e-copy-codec-switch')}
              checked={copyCodec}
              onChange={(event) => {
                onCopyCodecChange(event.target.checked);
              }}
            />
          }
          label="Copy Codec"
        />
        {window.platform === 'win32' && (
          <FormControlLabel
            control={
              <Switch
                inputProps={switchInputProps('e2e-wsl-switch')}
                checked={wsl}
                onChange={(event) => {
                  onWslChange(event.target.checked);
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
