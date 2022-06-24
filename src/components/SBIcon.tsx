import type { FC } from 'react';
import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import IconAssets from '../assets';

export type IconNames = keyof typeof IconAssets;
type SizeFactor = keyof typeof sizeStyles;

type Props = {
  icon: IconNames;
  color?: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

const SBIcon: FC<Props> & { Assets: typeof IconAssets } = ({ icon, size = 24, containerStyle, style, color }) => {
  const sizeStyle = sizeStyles[size as SizeFactor] ?? { width: size, height: size };
  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        resizeMode={'contain'}
        source={IconAssets[icon]}
        style={[sizeStyle, style, color ? { tintColor: color } : {}]}
      />
    </View>
  );
};

SBIcon.Assets = IconAssets;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const sizeStyles = StyleSheet.create({
  16: {
    width: 16,
    height: 16,
  },
  20: {
    width: 20,
    height: 20,
  },
  24: {
    width: 24,
    height: 24,
  },
  28: {
    width: 28,
    height: 28,
  },
  32: {
    width: 32,
    height: 32,
  },
});

export default SBIcon;
