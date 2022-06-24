import type { TextStyle } from 'react-native';

import Palette from './palette';

const scaleFactor = (n: number) => n;

export type Typo =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title1'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'button'
  | 'button2'
  | 'caption1'
  | 'caption2'
  | 'caption3'
  | 'caption4';
type FontAttributes = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing' | 'fontWeight' | 'color'
>;
const Typography: Record<Typo, FontAttributes> = {
  h1: {
    fontWeight: 'bold',
    fontSize: scaleFactor(18),
    lineHeight: scaleFactor(20),
    color: Palette.onBackgroundLight01,
  },
  h2: {
    fontWeight: 'bold',
    fontSize: scaleFactor(16),
    lineHeight: scaleFactor(20),
    letterSpacing: scaleFactor(-0.2),
    color: Palette.onBackgroundLight01,
  },
  h3: {
    fontWeight: 'bold',
    fontSize: scaleFactor(16),
    lineHeight: scaleFactor(20),
    letterSpacing: scaleFactor(-0.2),
    color: Palette.onBackgroundLight01,
  },
  title1: {
    fontWeight: '700',
    fontSize: scaleFactor(24),
    lineHeight: scaleFactor(28),
    color: Palette.onBackgroundLight01,
  },
  subtitle1: {
    fontWeight: '500',
    fontSize: scaleFactor(16),
    lineHeight: scaleFactor(22),
    letterSpacing: scaleFactor(-0.2),
    color: Palette.onBackgroundLight01,
  },
  subtitle2: {
    fontWeight: 'normal',
    fontSize: scaleFactor(16),
    lineHeight: scaleFactor(24),
    letterSpacing: scaleFactor(-0.2),
    color: Palette.onBackgroundLight01,
  },
  body1: {
    fontWeight: 'normal',
    fontSize: scaleFactor(16),
    lineHeight: scaleFactor(20),
    color: Palette.onBackgroundLight01,
  },
  body2: {
    fontWeight: '600',
    fontSize: scaleFactor(14),
    lineHeight: scaleFactor(16),
    color: Palette.onBackgroundLight02,
  },
  body3: {
    fontWeight: 'normal',
    fontSize: scaleFactor(14),
    lineHeight: scaleFactor(20),
    color: Palette.onBackgroundLight01,
  },
  button: {
    fontWeight: 'bold',
    fontSize: scaleFactor(14),
    lineHeight: scaleFactor(16),
    letterSpacing: scaleFactor(0.4),
    color: Palette.onBackgroundLight01,
  },
  button2: {
    fontWeight: '500',
    fontSize: scaleFactor(16),
    lineHeight: scaleFactor(16),
    letterSpacing: scaleFactor(-0.4),
    color: Palette.onBackgroundDark01,
  },
  caption1: {
    fontWeight: 'bold',
    fontSize: scaleFactor(12),
    lineHeight: scaleFactor(12),
    color: Palette.onBackgroundLight01,
  },
  caption2: {
    fontWeight: 'normal',
    fontSize: scaleFactor(12),
    lineHeight: scaleFactor(12),
    color: Palette.onBackgroundLight03,
  },
  caption3: {
    fontWeight: 'bold',
    fontSize: scaleFactor(11),
    lineHeight: scaleFactor(12),
    color: Palette.onBackgroundLight01,
  },
  caption4: {
    fontWeight: 'normal',
    fontSize: scaleFactor(11),
    lineHeight: scaleFactor(12),
    color: Palette.onBackgroundLight01,
  },
};

export default Typography;
