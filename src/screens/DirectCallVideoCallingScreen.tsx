import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';

import DirectCallControllerView from '../components/DirectCallControllerView';
import DirectCallVideoContentView from '../components/DirectCallVideoContentView';
import { useDirectCall } from '../hooks/useDirectCall';
import type { DirectRoutes } from '../navigations/routes';
import { useDirectNavigation } from '../navigations/useDirectNavigation';
import Palette from '../styles/palette';

const DirectCallVideoCallingScreen = () => {
  const { navigation, route } = useDirectNavigation<DirectRoutes.VIDEO_CALLING>();
  const { call, status, currentAudioDeviceIOS } = useDirectCall(route.params.callId);

  useEffect(() => {
    if (status === 'ended') {
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    }
  }, [status]);

  if (!call) return null;

  return (
    <View style={{ flex: 1, backgroundColor: Palette.background500 }}>
      <StatusBar hidden />
      {status !== 'ended' && <DirectCallVideoContentView status={status} call={call} />}
      <DirectCallControllerView status={status} call={call} ios_audioDevice={currentAudioDeviceIOS} />
    </View>
  );
};

export default DirectCallVideoCallingScreen;
