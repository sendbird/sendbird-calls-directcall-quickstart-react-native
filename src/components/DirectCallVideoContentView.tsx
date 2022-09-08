import React, { FC, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DirectCall, DirectCallVideoView } from '@sendbird/calls-react-native';

import { DirectCallStatus } from '../hooks/useDirectCall';

type CallStatusProps = {
  status: DirectCallStatus;
  call: DirectCall;
};
const DirectCallVideoContentView: FC<CallStatusProps> = ({ call, status }) => {
  const { left, top, viewWidth, viewHeight, scaleTo } = useLocalViewSize('large');

  useEffect(() => {
    switch (status) {
      case 'pending': {
        scaleTo('large');
        break;
      }
      case 'established':
      case 'connected':
      case 'reconnecting': {
        scaleTo('small');
        break;
      }
      case 'ended': {
        break;
      }
    }
  }, [status]);

  return (
    <View style={{ flex: 1 }}>
      <DirectCallVideoView
        mirror={false}
        resizeMode={'cover'}
        viewType={'remote'}
        callId={call.callId}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={{ left, top, width: viewWidth, height: viewHeight, backgroundColor: 'black' }}>
        <DirectCallVideoView
          mirror={true}
          resizeMode={'cover'}
          viewType={'local'}
          callId={call.callId}
          android_zOrderMediaOverlay
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const useLocalViewSize = (initialScale: 'small' | 'large' = 'large') => {
  const { width, height } = useWindowDimensions();
  const { top: topInset } = useSafeAreaInsets();

  const MAX_WIDTH = Math.min(width, height);
  const MIN_WIDTH = 96;
  const MAX_HEIGHT = Math.max(width, height);
  const MIN_HEIGHT = 160;

  const viewWidth = useRef(new Animated.Value(initialScale === 'large' ? MAX_WIDTH : MIN_WIDTH)).current;
  const left = viewWidth.interpolate({
    inputRange: [MIN_WIDTH, MAX_WIDTH],
    outputRange: [16, 0],
    extrapolate: 'clamp',
  });
  const top = viewWidth.interpolate({
    inputRange: [MIN_WIDTH, MAX_WIDTH],
    outputRange: [16 + topInset, 0],
    extrapolate: 'clamp',
  });
  const viewHeight = viewWidth.interpolate({
    inputRange: [MIN_WIDTH, MAX_WIDTH],
    outputRange: [MIN_HEIGHT, MAX_HEIGHT],
    extrapolate: 'clamp',
  });
  const scaleTo = (size: 'small' | 'large') => {
    Animated.timing(viewWidth, {
      toValue: size === 'small' ? MIN_WIDTH : MAX_WIDTH,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  return { left, top, viewWidth, viewHeight, scaleTo };
};

export default DirectCallVideoContentView;
