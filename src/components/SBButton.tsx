import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import Palette from '../styles/palette';
import type { ChildrenProps } from '../types/props';
import SBText from './SBText';

const buttonStyles = {
  contained: {
    enabled: {
      background: Palette.primary300,
      content: Palette.onBackgroundDark01,
    },
    pressed: {
      background: Palette.primary400,
      content: Palette.onBackgroundDark01,
    },
    disabled: {
      background: Palette.background100,
      content: Palette.onBackgroundLight04,
    },
  },
  text: {
    enabled: {
      background: Palette.transparent,
      content: Palette.primary300,
    },
    pressed: {
      background: Palette.transparent,
      content: Palette.primary300,
    },
    disabled: {
      background: Palette.transparent,
      content: Palette.onBackgroundLight04,
    },
  },
};

type Props = {
  style?: StyleProp<ViewStyle>;
  variant?: 'contained' | 'text';
  disabled?: boolean;
  onPress?: () => void;
  buttonColor?: string;
  contentColor?: string;
} & ChildrenProps;
const SBButton: React.FC<Props> = ({
  variant = 'contained',
  buttonColor,
  contentColor,
  disabled,
  onPress,
  style,
  children,
}) => {
  const getStateColor = (pressed: boolean, disabled?: boolean) => {
    const buttonStyle = buttonStyles[variant];
    if (disabled) {
      return buttonStyle.disabled;
    }
    if (pressed) {
      return buttonStyle.pressed;
    }
    return buttonStyle.enabled;
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => {
        const stateColor = getStateColor(pressed, disabled);
        return [{ backgroundColor: buttonColor ?? stateColor.background }, styles.container, style];
      }}
    >
      {({ pressed }) => {
        const stateColor = getStateColor(pressed, disabled);

        return (
          <SBText button2 color={contentColor ?? stateColor.content}>
            {children}
          </SBText>
        );
      }}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { marginVertical: -4, marginRight: 8 },
});

export default SBButton;
