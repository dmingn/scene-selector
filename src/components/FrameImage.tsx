/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { CircularProgress } from '@mui/material';
import { trpc } from '../trpc';

export const FrameImage = (props: {
  filePath: string;
  frameNumber: number;
}) => {
  const { data: image, isLoading: imageIsLoading } =
    trpc.getFrameImageBase64.useQuery({
      path: props.filePath,
      frameNumber: props.frameNumber,
    });

  return (
    <div
      css={css({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      })}
    >
      {imageIsLoading && (
        <CircularProgress
          css={css({
            width: '100%',
          })}
        />
      )}
      {image && (
        <img
          src={'data:image/png;base64,' + image}
          css={css({
            width: '100%',
            height: 'auto',
          })}
        />
      )}
    </div>
  );
};
