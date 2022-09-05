import { DirectCallProperties } from '@sendbird/calls-react-native';

import { useEffectAsync } from './useEffectAsync';
import { useForceUpdate } from './useForceUpdate';

export const useDirectCallDuration = (call: DirectCallProperties, interval = 1000) => {
  const forceUpdate = useForceUpdate();

  useEffectAsync(() => {
    const timer = setInterval(async () => {
      forceUpdate();
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [call, interval]);

  return new Date(call.duration).toISOString().substring(11, 19);
};
