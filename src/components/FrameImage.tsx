import { css, SerializedStyles } from '@emotion/react';
import { CircularProgress } from '@mui/material';
import { useContext } from 'react';
import { VideoContext } from '../contexts/VideoContext';
import { trpc } from '../trpc';

export const FrameImage = (props: {
  frameNumber: number;
  className?: string;
  css?: SerializedStyles;
}) => {
  const { filePath, fps } = useContext(VideoContext);

  const { data: image, isLoading: imageIsLoading } =
    trpc.getFrameImageBase64.useQuery(
      {
        videoPath: filePath,
        fps: fps,
        frameNumber: props.frameNumber,
      },
      {
        enabled: !!filePath && !!fps && props.frameNumber != null,
      },
    );

  return (
    <div
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
      {imageIsLoading && <CircularProgress css={css({ width: '100%' })} />}
      {image && (
        <img
          src={'data:image/png;base64,' + image}
          css={css({ width: '100%', height: 'auto' })}
        />
      )}
    </div>
  );
};
