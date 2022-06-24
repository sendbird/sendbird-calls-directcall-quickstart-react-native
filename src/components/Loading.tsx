import React, { FC, useEffect, useRef } from 'react';
import { Animated, Easing, Modal, StyleProp, View, ViewStyle } from 'react-native';

import Palette from '../styles/palette';
import SBIcon from './SBIcon';
import SBText from './SBText';

type Props = { visible: boolean };
const Loading: FC<Props> = ({ visible }) => {
  return (
    <Modal visible={visible} style={{ margin: 0 }} transparent animationType={'fade'}>
      <View style={{ flex: 1, backgroundColor: Palette.overlay02, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backgroundColor: Palette.onBackgroundLight01,
          }}
        >
          <Spin style={{ marginBottom: 8 }}>
            <SBIcon icon={'SpinnerLarge'} size={40} color={Palette.onBackgroundDark01} />
          </Spin>
          <SBText subtitle2 color={Palette.onBackgroundDark01}>
            {'Loading...'}
          </SBText>
        </View>
      </View>
    </Modal>
  );
};

const useLoopAnimated = (input: [number, number], duration: number, useNativeDriver = true) => {
  const animated = useRef(new Animated.Value(input[0])).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animated, { toValue: input[1], duration, useNativeDriver, easing: Easing.inOut(Easing.linear) }),
      { resetBeforeIteration: true },
    ).start();

    return () => {
      animated.stopAnimation();
      animated.setValue(0);
    };
  }, []);

  return animated;
};

const Spin: FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({ children, style }) => {
  const inputRange = [0, 1] as [number, number];
  const loop = useLoopAnimated(inputRange, 1000);
  const rotate = loop.interpolate({ inputRange, outputRange: ['0deg', '360deg'] });
  return <Animated.View style={[style, { transform: [{ rotate }] }]}>{children}</Animated.View>;
};

export default Loading;
