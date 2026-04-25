import { css, SerializedStyles } from '@emotion/react';
import { Button, CircularProgress } from '@mui/material';
import { useContext } from 'react';
import { getFrameImageBase64InputSchema } from '../../rpcSchema';
import { trpc } from '../trpc';
import { VideoInfoContext } from './context-providers/VideoInfoContextsProvider';

export const FrameImage = (props: {
  frameNumber: number;
  className?: string;
  css?: SerializedStyles;
}) => {
  const { filePath, fps } = useContext(VideoInfoContext);

  const getFrameImageBase64Input = {
    videoPath: filePath,
    fps: fps,
    frameNumber: props.frameNumber,
  };
  const {
    data: image,
    isLoading: imageIsPending,
    isError: imageIsError,
    refetch: refetchImage,
  } =
    trpc.getFrameImageBase64.useQuery(getFrameImageBase64Input, {
      enabled: getFrameImageBase64InputSchema.safeParse(
        getFrameImageBase64Input,
      ).success,
    });

  return (
    <div
      data-testid="e2e-frame-image"
      data-state={
        imageIsPending
          ? 'loading'
          : imageIsError
            ? 'error'
            : image
              ? 'ready'
              : 'idle'
      }
      className={props.className}
      css={[
        css({
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }),
        props.css,
      ]}
    >
      {imageIsPending && (
        <CircularProgress
          data-testid="e2e-frame-image-loading"
          css={css({ width: '100%' })}
        />
      )}
      {imageIsError && (
        <div
          data-testid="e2e-frame-image-error"
          css={css({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          })}
        >
          <div>Failed to load frame image.</div>
          <Button
            data-testid="e2e-frame-image-retry"
            variant="outlined"
            onClick={() => {
              refetchImage();
            }}
          >
            Retry
          </Button>
        </div>
      )}
      {image && (
        <img
          data-testid="e2e-frame-image-img"
          src={'data:image/png;base64,' + image}
          css={css({ width: '100%', height: 'auto' })}
        />
      )}
    </div>
  );
};
