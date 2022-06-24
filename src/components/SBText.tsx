import React, { useMemo } from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import Typography from '../styles/typography';
import type { Typo } from '../styles/typography';

type TypographyProps = Partial<Record<Typo, boolean>>;
export type TextProps = RNTextProps & TypographyProps & { color?: string };
const SBText: React.FC<TextProps> = ({ children, color, style, ...props }) => {
  const typoStyles = useTypographyFilter(props);
  return (
    <RNText style={[...typoStyles, style, !!color && { color }]} {...props}>
      {children}
    </RNText>
  );
};

const useTypographyFilter = ({
  h1,
  h2,
  h3,
  title1,
  subtitle1,
  subtitle2,
  body1,
  body2,
  body3,
  button,
  button2,
  caption1,
  caption2,
  caption3,
  caption4,
}: TypographyProps) => {
  return useMemo(
    () =>
      Object.entries({
        h1,
        h2,
        h3,
        title1,
        subtitle1,
        subtitle2,
        body1,
        body2,
        body3,
        button,
        button2,
        caption1,
        caption2,
        caption3,
        caption4,
      })
        .filter(([, val]) => val)
        .map(([key]) => Typography[key as Typo]),
    [h1, h2, h3, subtitle1, subtitle2, body1, body2, body3, button, button2, caption1, caption2, caption3, caption4],
  );
};

export default SBText;
