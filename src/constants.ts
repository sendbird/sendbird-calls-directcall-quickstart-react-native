import { Platform } from 'react-native';

export const DEFAULT_HEADER_HEIGHT = Platform.select({
  ios: 44,
  default: 56,
});
