import { useState } from 'react';

import type { AudioDeviceRoute } from '@sendbird/calls-react-native';
import { DirectCall, SendbirdCalls } from '@sendbird/calls-react-native';

import CallHistoryManager from '../libs/CallHistoryManager';
import { AppLogger } from '../utils/logger';
import { useEffectAsync } from './useEffectAsync';

export type DirectCallStatus = 'pending' | 'established' | 'connected' | 'reconnecting' | 'ended';
export const useDirectCall = (callId: string) => {
  const [, update] = useState(0);
  const forceUpdate = () => update((prev) => prev + 1);

  const [call, setCall] = useState<DirectCall>();
  const [status, setStatus] = useState<DirectCallStatus>('pending');
  const [currentAudioDeviceIOS, setCurrentAudioDeviceIOS] = useState<AudioDeviceRoute>({ inputs: [], outputs: [] });

  useEffectAsync(async () => {
    const directCall = await SendbirdCalls.getDirectCall(callId);
    setCall(directCall);

    return directCall.addListener({
      onEstablished() {
        setStatus('established');
      },
      onConnected() {
        setStatus('connected');
      },
      onReconnecting() {
        setStatus('reconnecting');
      },
      onReconnected() {
        setStatus('connected');
      },
      onEnded({ callId, callLog }) {
        AppLogger.info('[useDirectCall/onEnded] add to call history manager');
        callLog && CallHistoryManager.add(callId, callLog);
        setStatus('ended');
      },
      onAudioDeviceChanged(_, { platform, data }) {
        if (platform === 'ios') {
          setCurrentAudioDeviceIOS(data.currentRoute);
        } else {
          forceUpdate();
        }
      },
      onCustomItemsDeleted() {
        forceUpdate();
      },
      onCustomItemsUpdated() {
        forceUpdate();
      },
      onLocalVideoSettingsChanged() {
        forceUpdate();
      },
      onRemoteVideoSettingsChanged() {
        forceUpdate();
      },
      onRemoteAudioSettingsChanged() {
        forceUpdate();
      },
      onRemoteRecordingStatusChanged() {
        forceUpdate();
      },
      onUserHoldStatusChanged() {
        forceUpdate();
      },
      onPropertyUpdatedManually() {
        forceUpdate();
      },
    });
  }, []);

  return { call, status, currentAudioDeviceIOS };
};
