import { css, SerializedStyles } from '@emotion/react';
import { CircularProgress } from '@mui/material';
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
  const { data: image, isPending: imageIsPending } =
    trpc.getFrameImageBase64.useQuery(getFrameImageBase64Input, {
      enabled: getFrameImageBase64InputSchema.safeParse(
        getFrameImageBase64Input,
      ).success,
    });

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
      {imageIsPending && <CircularProgress css={css({ width: '100%' })} />}
      {image && (
        <img
          src={'data:image/png;base64,' + image}
          css={css({ width: '100%', height: 'auto' })}
        />
      )}
    </div>
  );
};
