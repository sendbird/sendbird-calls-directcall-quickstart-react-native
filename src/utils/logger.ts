import { Platform } from 'react-native';

import { getLogger } from '@sendbird/calls-react-native';

export const AppLogger = getLogger('debug', `[SampleApp_${Platform.OS}]`);
