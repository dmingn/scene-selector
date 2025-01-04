import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import {
  FrameNumbersAction,
  frameNumbersInitialState,
  frameNumbersReducer,
  FrameNumbersState,
} from '../../states/frameNumbers';
import { VideoInfoContext } from './VideoInfoContextsProvider';

export const FrameNumbersContext = createContext<FrameNumbersState>(null);

export const FrameNumbersDispatchContext =
  createContext<Dispatch<FrameNumbersAction>>(null);

export const FrameNumbersContextsProvider = (props: {
  children: ReactNode;
}) => {
  const { frameCount } = useContext(VideoInfoContext);

  const [frameNumbers, dispatchFrameNumbers] = useReducer(
    frameNumbersReducer,
    frameNumbersInitialState,
  );

  useEffect(() => {
    dispatchFrameNumbers({
      type: 'RESET',
      frameCount: frameCount ?? 0,
    });
  }, [frameCount]);

  return (
    <FrameNumbersContext.Provider value={frameNumbers}>
      <FrameNumbersDispatchContext.Provider value={dispatchFrameNumbers}>
        {props.children}
      </FrameNumbersDispatchContext.Provider>
    </FrameNumbersContext.Provider>
  );
};
