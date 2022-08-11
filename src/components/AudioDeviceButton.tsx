import React, { FC, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import {
  AVAudioSessionPort,
  AudioDevice,
  AudioDeviceRoute,
  AudioDeviceType,
  SendbirdCalls,
} from '@sendbird/calls-react-native';

import { useIIFE } from '../hooks/useEffectAsync';
import Palette from '../styles/palette';
import SBIcon, { IconNames } from './SBIcon';
import SBText from './SBText';

type Props = {
  currentAudioDeviceIOS: AudioDeviceRoute;

  currentAudioDeviceAndroid?: AudioDeviceType | null;
  availableAudioDevicesAndroid: AudioDeviceType[];
  onSelectAudioDeviceAndroid: (audioDevice: AudioDeviceType) => void;
};
const AudioDeviceButton: FC<Props> = ({
  currentAudioDeviceIOS,

  currentAudioDeviceAndroid,
  availableAudioDevicesAndroid = [],
  onSelectAudioDeviceAndroid,
}) => {
  const disabled = useIIFE(() => {
    if (Platform.OS === 'ios') {
      // return ios_currentAudioDevice.outputs[0]?.type === AVAudioSessionPort.builtInSpeaker;
    }
    if (Platform.OS === 'android') {
      if (availableAudioDevicesAndroid.length === 0) {
        return true;
      }
      // return android_currentAudioDevice === AudioDeviceType.SPEAKERPHONE;
    }
    return false;
  });

  const audioBtn = useIIFE((): IconNames => {
    if (Platform.OS === 'ios') {
      switch (currentAudioDeviceIOS.outputs[0]?.type) {
        case AVAudioSessionPort.bluetoothLE:
        case AVAudioSessionPort.bluetoothHFP:
        case AVAudioSessionPort.bluetoothA2DP:
          return 'btnBluetoothSelected';
        case AVAudioSessionPort.builtInSpeaker:
          return 'btnSpeakerSelected';
      }
    }

    if (Platform.OS === 'android') {
      switch (currentAudioDeviceAndroid) {
        case AudioDeviceType.BLUETOOTH:
          return 'btnBluetoothSelected';
        case AudioDeviceType.SPEAKERPHONE:
          return 'btnSpeakerSelected';
      }
    }

    return 'btnSpeaker';
  });

  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        disabled={disabled}
        onPress={async () => {
          if (Platform.OS === 'android') {
            setVisible(true);
          }
          if (Platform.OS === 'ios') {
            SendbirdCalls.ios_routePickerView();
          }
        }}
      >
        <SBIcon icon={audioBtn} size={64} />
      </TouchableOpacity>

      {Platform.OS === 'android' && (
        <AudioDeviceSelectModal
          currentDevice={currentAudioDeviceAndroid}
          devices={availableAudioDevicesAndroid}
          visible={visible}
          onSelect={(device) => {
            setVisible(false);
            device && onSelectAudioDeviceAndroid(device);
          }}
        />
      )}
    </>
  );
};

export const AudioDeviceSelectModal: FC<{
  currentDevice?: AudioDevice | null;
  devices: AudioDeviceType[];
  visible: boolean;
  onSelect: (device: AudioDeviceType | null) => void;
}> = ({ visible, devices, onSelect, currentDevice }) => {
  return (
    <Modal
      transparent
      hardwareAccelerated
      visible={visible}
      style={{ margin: 0 }}
      animationType={'fade'}
      onRequestClose={() => onSelect(null)}
    >
      <View style={menuStyles.container}>
        <View style={menuStyles.body}>
          <SBText h1 style={{ padding: 16 }}>
            {'Select audio device'}
          </SBText>
          {devices.map((device) => {
            return (
              <Pressable
                key={device}
                android_ripple={{ color: Palette.primary300 }}
                onPress={() => onSelect(device)}
                style={menuStyles.button}
              >
                <SBText body3 style={{ flex: 1, height: 24 }}>
                  {device}
                </SBText>
                {currentDevice === device && <SBIcon icon={'Done'} />}
              </Pressable>
            );
          })}
          <TouchableOpacity onPress={() => onSelect(null)} style={menuStyles.close}>
            <SBText button2 color={Palette.background600}>
              {'Close'}
            </SBText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const menuStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.overlay01,
  },
  body: {
    borderRadius: 12,
    width: 260,
    backgroundColor: Palette.background50,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  close: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AudioDeviceButton;
